import {Component, ElementRef, OnInit} from '@angular/core';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/lib/codemirror';
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
import {BuildingScriptMgeSvr} from '../../../service/building-script-mge.service';
import {LoginAuthorService} from '../../../service/login-author.service';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import {BuildingScript} from '../../../domain/buildingscript.domain';
import {MatSnackBar} from '@angular/material';
import {Domain} from '../../../domain/domain.domain';
import {CreateCodeSvr} from 'src/app/service/create-code.service';
import {ClassAttribute} from 'src/app/domain/classattribute.domain';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {TYPE_SCRIPT} from '../../../domain/global.enum';
import {BsModalService} from 'ngx-bootstrap/modal';
import {Project} from '../../../domain/project.domain';
import {Util} from '../../../share/class/util';


@Component({
  selector: 'app-script-edit',
  templateUrl: './script-edit.component.html',
  styleUrls: ['./script-edit.component.less']
})
export class ScriptEditComponent implements OnInit {
  public textJosn: Domain = new Domain();
  public script: BuildingScript = new BuildingScript();
  public resultStr = '';
  public code = `function createContent(domain){
  return domain.name;
}`; // 双向绑定，获取输入的语句
  public cmOptions = { // codemirror组件的配置项
    lineNumbers: true, // 显示行号
    styleActiveLine: true, // 当前行背景高亮
    lineWrapping: true, // 自动换行
    mode: {name: 'javascript', json: true}, // 定义mode
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
  public isLoading: boolean;
  public id: string;
  public showModal: BsModalRef; // 展示的模态框
  public redirectUrl: string;
  public scriptTypes: any[] = [];
  public isOwner: boolean;

  public get TYPE_SCRIPT() {
    return TYPE_SCRIPT;
  }


  constructor(
    private scriptMgeSvr: BuildingScriptMgeSvr,
    private loginAuthorService: LoginAuthorService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private createCodeSvr: CreateCodeSvr,
    private modalSvr: BsModalService,
    private elementRef: ElementRef,
  ) {
    this.getTypes();
    this.route.queryParams.subscribe(queryParam => {
      if (!!queryParam.redirect_url) {
        this.redirectUrl = decodeURIComponent(queryParam.redirect_url);
      } else {
        this.redirectUrl = '/script';
      }
    });
    router.events.subscribe(Event => {
      this.isLoading = true;
      if (Event instanceof NavigationEnd) {
        if (!this.id || this.id !== this.route.snapshot.paramMap.get('id')) {
          this.id = this.route.snapshot.paramMap.get('id');
          if (!!this.id) {
            this.id = this.id.split('?')[0];
            this.getShowInfo();
          } else {
            this.script.content = this.code;
            this.script.name = 'newScript';
            this.script.userId = this.loginAuthorService.userInfo.Name;
            this.isOwner = true;
          }
        }
      }
    });
  }

  ngOnInit() {
    const jStr = localStorage.getItem('textDomain');
    if (!!jStr) {
      this.textJosn = new Domain(JSON.parse(jStr));
    } else {
      this.textJosn = new Domain({
        name: 'test',
        describe: '测试对象',
        remark: '测试备注',
        type: 'object',
        nameSpace: 'test.service',
        assemblyName: 'test.service',
        classAttributes: [
          new ClassAttribute({
            name: 'id',
            type: 'string',
            describe: '编号'
          }),
          new ClassAttribute({
            name: 'name',
            type: 'string',
            describe: '姓名'
          })]
      });
    }
  }


  /**
   * 获取要修改的数据
   */
  public getShowInfo(): void {
    this.scriptMgeSvr.Get(this.loginAuthorService.token, this.id).then(res => {
      this.script = res;
      this.isOwner = this.script.userId === this.loginAuthorService.userInfo.Name;
    });
  }

  /**
   * 保存
   */
  public saveScript(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (!this.isOwner) {
        resolve(true);
      } else if (!this.script.id) {
        this.scriptMgeSvr.Create(this.loginAuthorService.token, this.script).then(res => {
          this.script = res;
          this.snackBar.open('保存成功', '', {duration: 2000});
          resolve(true);
        }, err => {
          this.snackBar.open('保存失败', '', {duration: 2000});
          resolve(false);
        });
      } else {
        this.scriptMgeSvr.Update(this.loginAuthorService.token, this.script.id, this.script).then(res => {
          this.script = res;
          this.snackBar.open('保存成功', '', {duration: 2000});
          resolve(true);
        }, err => {
          this.snackBar.open('保存失败', '', {duration: 2000});
          resolve(false);
        });
      }
    });

  }

  /**
   * 尝试执行
   */
  public run(): void {
    this.saveScript().then(save => {
      if (save) {
        this.createCodeSvr.Get(this.script.id, this.textJosn).then(res => {
          this.resultStr = res;
        }, err => {
          this.resultStr = JSON.stringify(err);
          this.snackBar.open('生成失败', '', {duration: 2000});
        });
      }
    });
  }

  /**
   * 展示模态框
   * @param modal 模态框
   * @param showLg 展示大模态框
   */
  public setShowModal(modal: any, showLg?): void {
    this.showModal = this.modalSvr.show(modal, showLg ? {class: 'modal-lg'} : {});
  }

  /**
   * 保存
   */
  public saveChange(): void {
    this.showModal.hide();
    this.textJosn = new Domain(this.textJosn);
    localStorage.setItem('textDomain', JSON.stringify(this.textJosn));

  }

  /**
   * 复制结果
   */
  public copyRes(): void {
    const copyHttp = this.elementRef.nativeElement.querySelector('#invite_code');
    const range = document.createRange();
    range.selectNode(copyHttp);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    this.snackBar.open('复制成功', '', {duration: 2000});
  }

  /**
   * 获取脚本类型
   */
  private getTypes(): void {
    const res = [];
    // tslint:disable-next-line:forin
    for (const item in TYPE_SCRIPT) {
      const num = Number.parseInt(item, 10);
      if (!isNaN(num)) {
        res.push({key: num, value: TYPE_SCRIPT[num]});
      }
    }
    this.scriptTypes = res;
  }
}
