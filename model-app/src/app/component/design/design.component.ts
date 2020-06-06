import {Component, OnInit, ViewChild} from '@angular/core';
import 'codemirror/mode/clike/clike';
import 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/xml-fold.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/markdown-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/edit/closeBrackets';
import 'codemirror/addon/edit/matchBrackets';
import {Project} from '../../domain/project.domain';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ProjectMgeSvr} from '../../service/project-mge.service';
import {LoginAuthorService} from '../../service/login-author.service';
import {DomainTreeComponent} from './domain-tree/domain-tree.component';
import {Domain} from 'src/app/domain/domain.domain';
import {MatSnackBar} from '@angular/material';
import {ShearPlateService} from '../../service/shear-plate.service';
import {Util} from '../../share/class/util';
import {FormControl} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {Script} from '../../domain/script.domain';
import {CreateCodeSvr} from '../../service/create-code.service';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.less']
})
export class DesignComponent implements OnInit {

  private id: string;
  public project: Project = new Project({name: '未命名'});
  public showType: number; // 展示数据类型（1：项目信息，2：对象信息）
  public showDomain: Domain = new Domain(); // 展示的对象
  public selected = new FormControl(0); // 展示的tab序号
  public domainList: Domain[] = []; // 展示的对象列表
  public projects: Project[] = []; // 我的项目列表
  public resultCode; // 生成的代码
  @ViewChild('tree', null) treeComp: DomainTreeComponent; // 对象树组件
  public cmOptions = { // codemirror组件的配置项
    lineNumbers: true, // 显示行号
    styleActiveLine: true, // 当前行背景高亮
    lineWrapping: true, // 自动换行
    mode: {name: 'text/x-csharp', json: true}, // 定义mode
    // theme: 'ambiance', // 设置黑色主题
    foldGutter: true,
    matchBrackets: true,  // 括号匹配
    autoCloseBrackets: true,
    extraKeys: {
      Ctrl: 'autocomplete', // 提示快捷键
      Tab(cm) {
        const spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
        cm.replaceSelection(spaces);
      }
    }, // 自动提示配置
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectMgeSvr: ProjectMgeSvr,
    private loginAuthor: LoginAuthorService,
    private snackBar: MatSnackBar,
    private shearPlateService: ShearPlateService,
    private titleService: Title,
    private createCodeSvr: CreateCodeSvr,
  ) {
    router.events.subscribe(Event => {
      if (Event instanceof NavigationEnd) {
        if (!this.id || this.id !== this.route.snapshot.paramMap.get('id')) {
          this.id = this.route.snapshot.paramMap.get('id');
          if (this.id) {
            this.getShowInfo();
          }
        }
      }
    });
  }

  ngOnInit() {
    this.titleService.setTitle('模型设计');
    const jStr = localStorage.getItem('project');
    if (!!jStr) {
      this.project = new Project(JSON.parse(jStr));
      if (!!this.project.id) {
        this.projectMgeSvr.Get(this.loginAuthor.token, this.project.id).then(res => {
          if (!res.id) {
            this.project.id = '';
          }
        });
      }
      this.domainList = this.project.getDomainList();
    }
  }

  /**
   * 获取项目数据
   */
  public getShowInfo(): void {
    this.projectMgeSvr.Get(this.loginAuthor.token, this.id).then(res => {
      this.project = res;
    });

  }

  /**
   * 添加对象信息
   * @param data 添加信息
   */
  public addDomain(data: any): void {
    if (data.level === 2) {
      this.project.domains.push(new Domain({
        name: data.name,
        id: data.id
      }));
      this.domainList = this.project.getDomainList();
      return;
    } else {
      for (const item of this.project.domains) {
        const father = this.getDomainNode(data.parentId, data.level - 1, item);
        if (!!father) {
          for (const child of father.childes) {
            if (child.id === data.id) {
              this.snackBar.open('添加失败', '', {duration: 2000});
              return;
            }
          }
          father.childes.push(new Domain({
            name: data.name,
            id: data.id
          }));
          this.domainList = this.project.getDomainList();
          return;
        }
      }
    }
    this.snackBar.open('添加失败', '', {duration: 2000});
  }

  /**
   * 删除节点
   * @param data 节点信息
   */
  public deleteDomain(data: any): void {
    if (data.level === 2) {
      for (let i = 0; i < this.project.domains.length; i++) {
        if (data.id === this.project.domains[i].id) {
          this.project.domains.splice(i, 1);
          this.domainList = this.project.getDomainList();
          return;
        }
      }
    } else {
      for (const item of this.project.domains) {
        const father = this.getDomainNode(data.parentId, data.level - 1, item);
        if (!!father) {
          for (let i = 0; i < father.childes.length; i++) {
            if (data.id === father.childes[i].id) {
              father.childes.splice(i, 1);
              this.domainList = this.project.getDomainList();
              return;
            }
          }
        }
      }
    }
    this.snackBar.open('删除失败', '', {duration: 2000});
  }

  /**
   * 复制节点
   * @param data 节点信息
   */
  public copyDomain(data: any): void {
    if (data.level === 2) {
      for (const domain of this.project.domains) {
        if (data.id === domain.id) {
          this.shearPlateService.settype(0);
          this.shearPlateService.set(JSON.stringify(domain));
          this.snackBar.open('复制成功', '', {duration: 2000});
          return;
        }
      }
    } else {
      for (const item of this.project.domains) {
        const father = this.getDomainNode(data.parentId, data.level - 1, item);
        if (!!father) {
          for (const domain of father.childes) {
            if (data.id === domain.id) {
              this.shearPlateService.settype(0);
              this.shearPlateService.set(JSON.stringify(domain));
              this.snackBar.open('复制成功', '', {duration: 2000});
              return;
            }
          }
        }
      }
    }
    this.snackBar.open('复制失败', '', {duration: 2000});
  }

  /**
   * 粘贴节点
   * @param data 节点信息
   */
  public pasteDomain(data: any): void {
    const newDomain = new Domain(data.domain);
    newDomain.childes = [];
    if (data.level === 2) {
      this.project.domains.push(newDomain);
      this.domainList = this.project.getDomainList();
      return;
    } else {
      for (const item of this.project.domains) {
        const father = this.getDomainNode(data.parentId, data.level - 1, item);
        if (!!father) {
          for (const child of father.childes) {
            if (child.id === data.id) {
              this.snackBar.open('添加失败', '', {duration: 2000});
              return;
            }
          }
          father.childes.push(newDomain);
          this.domainList = this.project.getDomainList();
          return;
        }
      }
    }
    this.snackBar.open('添加失败', '', {duration: 2000});
  }

  /**
   * 展示节点信息
   * @param data 要展示的节点
   */
  public setShowDomain(data: any): void {
    this.selected.setValue(0);
    if (data.level === 1) {
      this.showType = 1;
      return;
    } else {
      this.showType = 2;
      for (const item of this.project.domains) {
        const showData = this.getDomainNode(data.id, data.level, item);
        if (!!showData) {
          this.showDomain = showData;
          return;
        }
      }
    }
  }


  /**
   * 节点重命名
   * @param evt 重命名信息
   */
  public rename(evt?: any): void {
    if (!!evt) {
      this.treeComp.rename(evt.id, evt.name);
    } else {
      this.treeComp.rename(this.project.id, this.project.name);
    }
    this.domainList = this.project.getDomainList();
  }

  /**
   * 查询项目
   * @param item 被查询项目
   */
  public showProject(item: Project): void {
    this.projectMgeSvr.Get(this.loginAuthor.token, item.id).then(res => {
      this.project = res;
    });
  }

  /**
   * 展示项目列表
   */
  public showProjects(): void {
    this.projectMgeSvr.QueryList(this.loginAuthor.token, '', 0, -1).then(res => {
      this.projects = res.list;
    });
  }

  /**
   * 新建项目
   */
  public newProject(): void {
    this.project = new Project({name: '未命名'});
  }

  /**
   * 保存本地数据
   */
  public saveProject(): void {
    if (!this.project.id) {
      this.projectMgeSvr.Create(this.loginAuthor.token, this.project).then(res => {
        this.project.id = res.id;
        this.saveProjectLocal();
      });
    } else {
      this.projectMgeSvr.Update(this.loginAuthor.token, this.project.id, this.project).then(res => {
        this.project.id = res.id;
        this.saveProjectLocal();
      });
    }
  }


  /**
   * 运行脚本
   * @param data 脚本模板
   */
  public showScript(data: any): void {
    if (data.level === 1) {
      this.selected.setValue(0);
      this.showType = 1;
      return;
    } else {
      let domainId = data.domainId;
      while (!domainId) {
        const parent = this.getScriptParent(data.id, data.level);
        if (!!parent) {
          if (!!parent.domainId) {
            domainId = parent.domainId;
          }
        } else {
          break;
        }
      }
      if (!!domainId) {
        this.domainList = this.project.getDomainList();
        for (const item of this.domainList) {
          if (item.id === domainId) {
            this.createCodeSvr.Get(data.scriptId, item).then(res => {
              this.resultCode = res;
              this.selected.setValue(1);
            }, err => {
              this.resultCode = err;
              this.selected.setValue(1);
            });
            return;
          }
        }
      }
      this.snackBar.open('生成失败', '', {duration: 2000});
    }
  }

  /**
   * 添加脚本模板
   * @param data 脚本模板
   */
  public addScript(data: any): void {
    if (data.level === 2) {
      this.project.scripts.push(new Script({
        buildScriptId: data.scriptId,
        id: data.id
      }));
      return;
    } else {
      for (const item of this.project.scripts) {
        const father = this.getScriptNode(data.parentId, data.level - 1, item);
        if (!!father) {
          for (const child of father.childes) {
            if (child.id === data.id) {
              this.snackBar.open('添加失败', '', {duration: 2000});
              return;
            }
          }
          father.childes.push(new Script({
            buildScriptId: data.scriptId,
            id: data.id
          }));
          return;
        }
      }
    }
    this.snackBar.open('添加失败', '', {duration: 2000});
  }


  /**
   * 修改脚本模板
   * @param data 脚本模板
   */
  public updateScript(data: any): void {
    for (const item of this.project.scripts) {
      const node = this.getScriptNode(data.id, data.level, item);
      if (!!node) {
        if (!!data.script) {
          node.buildScriptId = data.scriptId;
        }
        if (!!data.domainId) {
          node.domainId = data.domainId;
        } else {
          node.domainId = '';
        }
        return;
      }
    }
  }


  /**
   * 删除脚本模板
   * @param data 脚本模板
   */
  public deleteScript(data: any): void {
    if (data.level === 2) {
      for (let i = 0; i < this.project.scripts.length; i++) {
        if (data.id === this.project.scripts[i].id) {
          this.project.scripts.splice(i, 1);
          return;
        }
      }
    } else {
      for (const item of this.project.scripts) {
        const father = this.getScriptNode(data.parentId, data.level - 1, item);
        if (!!father) {
          for (let i = 0; i < father.childes.length; i++) {
            if (data.id === father.childes[i].id) {
              father.childes.splice(i, 1);
              return;
            }
          }
        }
      }
    }
    this.snackBar.open('删除失败', '', {duration: 2000});
  }


  private getDomainNode(id: string, level: number, father: Domain): Domain {
    if (level > 2) {
      for (const item of father.childes) {
        const res = this.getDomainNode(id, level - 1, item);
        if (!!res) {
          return res;
        }
      }
    } else {
      if (father.id === id) {
        return father;
      } else {
        return null;
      }
    }
    return null;
  }

  private getScriptNode(id: string, level: number, father: Script): Script {
    if (level > 2) {
      for (const item of father.childes) {
        const res = this.getScriptNode(id, level - 1, item);
        if (!!res) {
          return res;
        }
      }
    } else {
      if (father.id === id) {
        return father;
      } else {
        return null;
      }
    }
    return null;
  }

  private getScriptParent(id: string, level: number, nowNode?: Script): Script {
    let list;
    if (!!nowNode) {
      list = nowNode.childes;
    } else {
      list = this.project.scripts;
    }
    if (level <= 1) {
      return null;
    }
    if (level > 2) {
      for (const item of list) {
        const res = this.getScriptParent(id, level - 1, item);
        if (!!res) {
          return res;
        }
      }
    } else {
      for (const item of list) {
        if (item.id === id) {
          return nowNode;
        }
      }
    }
    return null;
  }

  private saveProjectLocal(): void {
    localStorage.setItem('project', JSON.stringify(this.project));
    this.snackBar.open('保存成功', '', {duration: 2000});
  }

}
