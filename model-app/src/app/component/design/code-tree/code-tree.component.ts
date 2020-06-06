import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, EventEmitter, Injectable, Input, OnInit, Output} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';
import {Domain} from '../../../domain/domain.domain';
import {Util} from '../../../share/class/util';
import {LoginAuthorService} from '../../../service/login-author.service';
import {BuildingScriptMgeSvr} from '../../../service/building-script-mge.service';
import {BuildingScript} from '../../../domain/buildingscript.domain';
import {DataList} from '../../../domain/datalist.domain';
import {Project} from '../../../domain/project.domain';
import {MatSnackBar} from '@angular/material';
import {Script} from '../../../domain/script.domain';
import {NzContextMenuService, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';
import {ShearPlateService} from '../../../service/shear-plate.service';
import {TYPE_SCRIPT} from '../../../domain/global.enum';

/**
 * Node for to-do item
 */
export class TodoItemNode {
  children: TodoItemNode[];
  name: string;
  id: string;
  level: number;
  domainId: string;

  constructor(options: {
    children?: TodoItemNode[];
    name?: string;
    level?: number;
    id?: string;
    domainId?: string;

  } = {}) {
    this.children = !!options.children ? options.children : [];
    this.name = options.name || '';
    this.level = options.level;
    this.id = options.id || Util.uuid();
    this.domainId = options.domainId || '';
  }

}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  id: string;
  name: string;
  level: number;
  domainId: string;
  expandable: boolean;
  childzero: boolean;
  isShow: boolean;
}


/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class Codeatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }

  constructor(project: Project) {
    this.initialize(project);
  }

  initialize(project: Project) {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(project);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: Project): TodoItemNode[] {
    const scripts = new TodoItemNode({name: obj.name, children: [], level: 1, id: obj.id});
    for (const script of obj.scripts) {
      const item = this.buildNode(script, 2);
      scripts.children.push(item);
    }
    const res = new TodoItemNode({children: []});
    res.children.push(scripts);
    return res.children;
  }

  buildNode(obj: Script, level: number): TodoItemNode {
    const res = new TodoItemNode({name: obj.buildScriptId, children: [], level, id: obj.id, domainId: obj.domainId});
    for (const item of obj.childes) {
      res.children.push(this.buildNode(item, level + 1));
    }
    return res;
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string, id?: string) {
    if (parent.children) {
      const syandBy = new TodoItemNode({name, children: [], level: parent.level + 1, id: !!id ? id : Util.uuid()});
      parent.children.push(syandBy);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name?: string, domainId?: string) {
    let sign = false;
    if (!!name) {
      node.name = name;
      sign = true;
    }
    if (!!domainId) {
      node.domainId = domainId;
      sign = true;
    }
    if (sign) {
      this.dataChange.next(this.data);
    }
  }

  deleteItem(id: string, parent: TodoItemNode) {
    let i = 0;
    for (const item of parent.children) {
      if (item.id === id) {
        parent.children.splice(i, 1);
        break;
      } else {
        i++;
      }
    }
    this.dataChange.next(this.data);
  }
}

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'app-code-tree',
  templateUrl: './code-tree.component.html',
  styleUrls: ['./code-tree.component.less']
})
export class CodeTreeComponent implements OnInit {


  public domains: Domain[];
  public scripts: BuildingScript[] = [];
  database: Codeatabase;
  public chooseItem: TodoItemFlatNode = new TodoItemFlatNode();
  public copyBase: TodoItemNode;

  public get TYPE_SCRIPT() {
    return TYPE_SCRIPT;
  }


  @Output() addItemEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateItemEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() delItemEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() showItemEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() copyItemEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() pasteItemEmitter: EventEmitter<any> = new EventEmitter<any>();

  @Input() set setdomains(value: Domain[]) {
    this.domains = value;
  }

  @Input() set setDatabase(database: Project) {
    this.database = new Codeatabase(database);
    this.database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  constructor(
    public snackBar: MatSnackBar,
    private loginAuthor: LoginAuthorService,
    private buildingScriptMgeSvr: BuildingScriptMgeSvr,
    private nzContextMenuService: NzContextMenuService,
    private shearPlateService: ShearPlateService,
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  }

  ngOnInit(): void {
    this.buildingScriptMgeSvr.QueryFavoriteList(this.loginAuthor.token).then(res => {
      this.scripts = res;
    });

  }

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  // tslint:disable-next-line:variable-name
  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  // tslint:disable-next-line:variable-name
  hasChildButNo = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.childzero;

  // tslint:disable-next-line:variable-name
  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => !_nodeData.name;

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, node: TodoItemFlatNode): void {
    this.nzContextMenuService.create($event, menu);
    this.chooseItem = node;
  }

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.name === node.name && (!existingNode.childzero || node.children.length <= 0) && (existingNode.childzero || node.children.length > 0)
    && (existingNode.domainId === node.domainId)
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.domainId = node.domainId;
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.id = node.id;
    flatNode.expandable = !!node.children && node.children.length > 0;
    flatNode.childzero = !!node.children && node.children.length === 0;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this.database.insertItem(parentNode, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, script: BuildingScript) {
    if (!script) {
      this.snackBar.open('请选择', '', {duration: 2000});
      return;
    }
    const parent = this.getParentNode(node);
    let nestedNode = this.flatNodeMap.get(node);
    this.addItemEmitter.emit({parentId: parent.id, id: nestedNode.id, scriptId: script.id, level: nestedNode.level});
    nestedNode = this.flatNodeMap.get(node);
    this.database.updateItem(nestedNode, script.id);
  }

  /** 修改节点信息 */
  updateNode(node: TodoItemFlatNode, scriptId?: string, domainId?: string) {
    let nestedNode = this.flatNodeMap.get(node);
    this.updateItemEmitter.emit({id: nestedNode.id, scriptId, domainId, level: nestedNode.level});
    nestedNode = this.flatNodeMap.get(node);
    this.database.updateItem(nestedNode, !!scriptId ? scriptId : '', !!domainId ? domainId : '');
  }

  /** 删除节点 */
  deleteNode(node: TodoItemFlatNode, isDelete = true): void {
    const parentNode = this.flatNodeMap.get(this.getParentNode(node));
    const nestedNode = this.flatNodeMap.get(node);
    if (isDelete) {
      this.delItemEmitter.emit({parentId: parentNode.id, id: nestedNode.id, level: nestedNode.level});
    }
    this.database.deleteItem(node.id, parentNode);
    this.treeControl.expand(node);
  }

  /** 显示节点内容 */
  showDetails(node: TodoItemFlatNode): void {
    for (const item of this.flatNodeMap.keys()) {
      item.isShow = false;
    }
    node.isShow = true;
    const nestedNode = this.flatNodeMap.get(node);
    this.showItemEmitter.emit({id: nestedNode.id, scriptId: node.name, domainId: node.domainId, level: nestedNode.level});
  }

  /**
   * 关闭菜单
   */
  public close(): void {
    this.nzContextMenuService.close();
  }

  /**
   * 复制
   */
  public copy(): void {
    if (this.chooseItem.level === 0) {
      return;
    }
    this.copyBase = this.flatNodeMap.get(this.chooseItem);
    const parent = this.getParentNode(this.chooseItem);
    this.copyItemEmitter.emit({parentId: parent.id, id: this.copyBase.id, level: this.copyBase.level});
  }

  /**
   * 剪切
   */
  public shear(): void {
    if (this.chooseItem.level === 0) {
      return;
    }
    this.copyBase = this.flatNodeMap.get(this.chooseItem);
    const parent = this.getParentNode(this.chooseItem);
    this.copyItemEmitter.emit({parentId: parent.id, id: this.copyBase.id, level: this.copyBase.level});
    this.deleteNode(this.chooseItem);
  }

  /**
   * 粘贴
   */
  public paste(): void {
    if (this.shearPlateService.gettype() !== 0) {
      return;
    }
    const domain = new Domain(JSON.parse(this.shearPlateService.get()));
    const parentNode = this.flatNodeMap.get(this.chooseItem);
    this.pasteNode(domain, parentNode);
  }

  /**
   * 删除节点
   */
  public delete(): void {
    if (this.chooseItem.level === 0) {
      return;
    }
    this.deleteNode(this.chooseItem);
  }


  /**
   * 递归粘贴节点
   * @param domain 剪粘板的节点信息
   * @param father 父节点
   */
  private pasteNode(domain: Domain, father: TodoItemNode): void {
    const newId = Util.uuid();
    this.database.insertItem(father, domain.name, newId);
    this.treeControl.expand(this.chooseItem);
    domain.id = newId;

    this.pasteItemEmitter.emit({
      parentId: father.id,
      id: newId,
      name: this.copyBase.name,
      level: father.level + 1,
      domain
    });
    if (!!domain.childes && domain.childes.length > 0) {
      for (const item of this.nestedNodeMap) {
        if (item[0].id === newId) {
          this.chooseItem = item[1];
          for (const newDomain of domain.childes) {
            this.pasteNode(newDomain, item[0]);
          }
          return;
        }
      }
    }

  }

  /**
   * 检测是否空列表
   */
  public checklist(): void {
    if (!this.scripts || this.scripts.length <= 0) {
      this.snackBar.open('请先订阅模板', '', {duration: 2000});
    }
  }
}


