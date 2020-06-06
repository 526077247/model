import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, Injectable, Input, Output, EventEmitter, TemplateRef} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';
import {Domain} from '../../../domain/domain.domain';
import {TodoItemNode, TodoItemFlatNode} from 'src/app/domain/todoitemnode.domain';
import {Project} from 'src/app/domain/project.domain';
import {MatSnackBar} from '@angular/material';
import {Util} from '../../../share/class/util';
import {ShearPlateService} from '../../../service/shear-plate.service';
import {NzContextMenuService, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';


/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }

  constructor(proData: Project) {
    this.initialize(proData);
  }

  initialize(proData: Project) {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(proData);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: Project): TodoItemNode[] {
    const domains = new TodoItemNode({name: obj.name, children: [], level: 1, id: obj.id});
    for (const domain of obj.domains) {
      const item = this.buildNode(domain, 2);
      domains.children.push(item);
    }
    const res = new TodoItemNode({children: []});
    res.children.push(domains);
    return res.children;
    // const domains = new TodoItemNode({item: obj.name, children: [], level: 0, id: obj.id});
    // for (const domain of obj.domains) {
    //   const item = this.buildNode(domain, 1);
    //   domains.children.push(item);
    // }
    // return domains.children;
  }

  buildNode(obj: Domain, level: number): TodoItemNode {
    const res = new TodoItemNode({name: obj.name, children: [], level, id: obj.id});
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

  updateItem(node: TodoItemNode, name: string) {
    node.name = name;
    this.dataChange.next(this.data);
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

  refresh(): void {
    this.dataChange.next(this.data);
  }
}

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'app-domain-tree',
  templateUrl: './domain-tree.component.html',
  styleUrls: ['./domain-tree.component.less']
})
export class DomainTreeComponent {
  public chooseItem: TodoItemFlatNode = new TodoItemFlatNode();
  public copyBase: TodoItemNode;
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
  database: ChecklistDatabase;
  treeControl: FlatTreeControl<TodoItemFlatNode>;
  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  constructor(
    private snackBar: MatSnackBar,
    private nzContextMenuService: NzContextMenuService,
    private shearPlateService: ShearPlateService,
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }


  @Output() addItemEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() delItemEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() showItemEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() copyItemEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() pasteItemEmitter: EventEmitter<any> = new EventEmitter<any>();

  @Input() set setDatabase(database: Project) {
    this.database = new ChecklistDatabase(database);
    this.database.dataChange.subscribe(data => {
      this.dataSource.data = data;
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
      ? existingNode
      : new TodoItemFlatNode();
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

  /** Checks all the parents when a leaf node is selected/unselected */
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

  /* 获取父节点 */
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

  /** 新增节点 */
  addNewItem(node: TodoItemFlatNode): void {
    const parentNode = this.flatNodeMap.get(node);
    this.database.insertItem(parentNode, '');
    this.treeControl.expand(node);
  }

  /** 保存节点 */
  saveNode(node: TodoItemFlatNode, itemValue: string): void {
    if (!itemValue) {
      this.snackBar.open('请输入名称', '', {duration: 2000});
      return;
    }
    const parent = this.getParentNode(node);
    let nestedNode = this.flatNodeMap.get(node);
    if (!node.name) {
      this.addItemEmitter.emit({parentId: parent.id, id: nestedNode.id, name: itemValue, level: nestedNode.level});
    }
    nestedNode = this.flatNodeMap.get(node);
    this.database.updateItem(nestedNode, itemValue);
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
    let parent = new TodoItemFlatNode();
    if (node.level > 1) {
      parent = this.getParentNode(node);
    }
    const nestedNode = this.flatNodeMap.get(node);
    this.showItemEmitter.emit({parentId: parent.id || '', id: nestedNode.id, name: nestedNode.name, level: nestedNode.level});
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
   * 重命名
   * @param id 节点id
   * @param name 节点新名称
   */
  public rename(id: string, name: string): void {
    for (const item of this.nestedNodeMap) {
      if (item[0].id === id) {
        item[0].name = name;
        item[1].name = name;
        return;
      }
    }
  }

}
