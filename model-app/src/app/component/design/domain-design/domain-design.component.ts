import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ElementRef} from '@angular/core';
import {Domain} from '../../../domain/domain.domain';
import {ClassAttribute, TYPE_OF_SQL} from '../../../domain/classattribute.domain';
import {Util} from '../../../share/class/util';
import {Method} from 'src/app/domain/method.domain';
import {Parameter} from 'src/app/domain/parameter.domain';
import {NzContextMenuService, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';
import {MatSnackBar} from '@angular/material';
import {ShearPlateService} from 'src/app/service/shear-plate.service';

@Component({
  selector: 'app-domain-design',
  templateUrl: './domain-design.component.html',
  styleUrls: ['./domain-design.component.less']
})
export class DomainDesignComponent implements OnInit {

  @Input() set setShowDomain(data: Domain) {
    this.modifyDomain = data;
  }

  @Input() set setDropDownList(data: Domain[]) {
    this.classes = data;
  }

  get sqlType(): any {
    return TYPE_OF_SQL;
  }

  constructor(
    private nzContextMenuService: NzContextMenuService,
    private snackBar: MatSnackBar,
    private elementRef: ElementRef,
    private shearPlateService: ShearPlateService,
  ) {
  }

  public baseClasses: string[] = [];
  public classes: Domain[] = [];
  public modifyDomain: Domain;
  public showMethodId: string;
  public clickType: number;
  public copyContent: string;
  @Output() nameChangeEmitter: EventEmitter<any> = new EventEmitter<any>();

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, type: number): void {
    this.nzContextMenuService.create($event, menu);
    this.clickType = type;
  }

  ngOnInit() {
    this.baseClasses = ['string', 'int', 'double', 'float', 'decimal', 'number', 'long', 'DateTime', 'DataBase'];
  }

  /**
   * 添加属性
   */
  public addClassAttribute(): void {
    this.modifyDomain.classAttributes.push(new ClassAttribute({id: Util.uuid()}));
  }

  /**
   * 添加方法
   */
  public addMethod(): void {
    this.modifyDomain.methods.push(new Method({id: Util.uuid()}));
  }

  /**
   * 添加参数
   * @param item 方法
   */
  public addPara(item: Method): void {
    item.parameters.push(new Parameter({id: Util.uuid(), methodId: item.id}));
  }

  /**
   * 删除属性
   * @param item 属性
   */
  public deleteAttr(item: ClassAttribute): void {
    for (let i = 0; i < this.modifyDomain.classAttributes.length; i++) {
      if (this.modifyDomain.classAttributes[i].id === item.id) {
        this.modifyDomain.classAttributes.splice(i, 1);
        return;
      }
    }
  }

  /**
   * 删除方法
   * @param item 方法
   */
  public deleteMethod(item: Method): void {
    for (let i = 0; i < this.modifyDomain.methods.length; i++) {
      if (this.modifyDomain.methods[i].id === item.id) {
        this.modifyDomain.methods.splice(i, 1);
        return;
      }
    }
  }

  /**
   * 删除参数
   * @param item 方法
   * @param para 参数
   */
  public deletePara(item: Method, para: Parameter) {
    for (let i = 0; i < item.parameters.length; i++) {
      if (item.parameters[i].id === para.id) {
        item.parameters.splice(i, 1);
        return;
      }
    }
  }

  /**
   * 是否选择
   * @param type 类型
   * @param item 属性
   */
  public isCheck(type: number, item: ClassAttribute): boolean {
    // tslint:disable-next-line:no-bitwise
    return (item.sqlOption & type) === type;
  }

  /**
   * 改变选择状态
   * @param type 类型
   * @param item 属性
   */
  public changeCheck(type: number, item: ClassAttribute): void {
    setTimeout(() => {
      // tslint:disable-next-line:no-bitwise
      item.sqlOption = (item.sqlOption & type) === type ? (item.sqlOption - type) : (item.sqlOption + type);
    });

  }

  /**
   * 改变选中状态
   * @param item 属性
   */
  public changeAttrCheck(item: ClassAttribute): void {
    setTimeout(() => {
      item.isCheck = !item.isCheck;
    });
  }

  /**
   * 改变选中状态
   * @param item 方法
   */
  public changeMethodCheck(item: Method): void {
    setTimeout(() => {
      item.isCheck = !item.isCheck;
      if(this.showMethodId){
        for (const item of this.modifyDomain.methods) {
          if(this.showMethodId === item.id){
            for (const para of item.parameters) {
              para.isCheck = false;
            }
            break;
          }
        }
      }
    });
  }

  public changeParaCheck(item: Parameter): void {
    setTimeout(() => {
      item.isCheck = !item.isCheck;
      for (const item of this.modifyDomain.methods) {
        item.isCheck = false;
      }
    });
  }

  /**
   * 展示或收起方法参数
   * @param item 方法
   */
  public showMethodPara(item: Method) {
    if(this.showMethodId){
      for (const para of item.parameters) {
        para.isCheck = false;
      }
    }
    this.showMethodId = this.showMethodId === item.id ? '' : item.id;
  }

  /**
   * 属性是否全选
   */
  public isAllAttrCheck(): boolean {
    if (this.modifyDomain.classAttributes.length <= 0) {
      return false;
    }
    for (const item of this.modifyDomain.classAttributes) {
      if (!item.isCheck) {
        return false;
      }
    }
    return true;
  }

  /**
   * 全选属性
   */
  public checkAttrAll(): void {
    setTimeout(() => {
      if (this.isAllAttrCheck()) {
        for (const item of this.modifyDomain.classAttributes) {
          item.isCheck = false;
        }
      } else {
        for (const item of this.modifyDomain.classAttributes) {
          item.isCheck = true;
        }
      }
    });
  }

  /**
   * 方法是否全选
   */
  public isAllMethodCheck(): boolean {
    if (this.modifyDomain.methods.length <= 0) {
      return false;
    }
    for (const item of this.modifyDomain.methods) {
      if (!item.isCheck) {
        return false;
      }
    }
    return true;
  }

  /**
   * 全选方法
   */
  public checkMethodAll(): void {
    setTimeout(() => {
      if (this.isAllMethodCheck()) {
        for (const item of this.modifyDomain.methods) {
          item.isCheck = false;
        }
      } else {
        for (const item of this.modifyDomain.methods) {
          item.isCheck = true;
        }
        if(this.showMethodId){
          for (const item of this.modifyDomain.methods) {
            if(this.showMethodId === item.id){
              for (const para of item.parameters) {
                para.isCheck = false;
              }
              break;
            }
          }
        }
      }
    });
  }

  /**
   * 參數是否全选
   */
  public isAllParaCheck(method: Method): boolean {
    if (method.parameters.length <= 0) {
      return false;
    }
    for (const item of method.parameters) {
      if (!item.isCheck) {
        return false;
      }
    }
    return true;
  }

  /**
   * 全选參數
   */
  public checkParaAll(method: Method): void {
    setTimeout(() => {
      if (this.isAllParaCheck(method)) {
        for (const item of method.parameters) {
          item.isCheck = false;
        }
      } else {
        for (const item of method.parameters) {
          item.isCheck = true;
        }
        for (const item of this.modifyDomain.methods) {
          item.isCheck = false;
        }
      }
    });
  }

  public close(): void {
    this.nzContextMenuService.close();
  }

  public copy(): void {
    const res = [];
    let tempType = this.clickType;
    if (tempType === 1) {
      for (const item of this.modifyDomain.classAttributes) {
        if (item.isCheck) {
          res.push(item);
        }
      }
    } else if (tempType === 2) {
      if(!!this.showMethodId){
        for (const item of this.modifyDomain.methods) {
          if (this.showMethodId === item.id) {
            for (const item2 of item.parameters) {
              if (item2.isCheck) {
                tempType = 3
                res.push(item2);
              }
            }
            break;
          }
        }
      }
      if(tempType !== 3){
        for (const item of this.modifyDomain.methods) {
          if (item.isCheck) {
            res.push(item);
          }
        }
      }
    }
    this.copyContent = JSON.stringify(res);
    setTimeout(() => {
      const copyHttp = this.elementRef.nativeElement.querySelector('#invite_code');
      const range = document.createRange();
      range.selectNode(copyHttp);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      this.shearPlateService.set(this.copyContent);
      this.shearPlateService.settype(tempType);
      this.snackBar.open(res.length <= 0 ? '未选择复制项' : `复制${res.length}条成功`, '', {duration: 2000});
    });
  }

  public paste(): void {
    const type = this.shearPlateService.gettype()
    if (type !== this.clickType&&type!==3) {
      this.snackBar.open('类型不匹配', '', {duration: 2000});
      return;
    }
    const res = this.shearPlateService.get();
    let list = [];
    if (!!res) {
      list = JSON.parse(res);
    }
    if (list.length <= 0) {
      this.snackBar.open('无可粘贴数据', '', {duration: 2000});
      return;
    }
    let count = 0;
    if (type === 1) {
      for (const item of list) {
        item.id = Util.uuid();
        item.domainId = this.modifyDomain.id;
        this.modifyDomain.classAttributes.push(new ClassAttribute(item));
        count++;
      }
    } else if (type === 2) {
      for (const item of list) {
        item.id = Util.uuid();
        item.domainId = this.modifyDomain.id;
        this.modifyDomain.methods.push(new Method(item));
        count++;
      }
    }else if (type === 3) {
      if(!this.showMethodId){
        this.snackBar.open('类型不匹配', '', {duration: 2000});
        return;
      }
      for(const method of this.modifyDomain.methods){
        if(method.id === this.showMethodId){
          for (const item of list) {
            item.id = Util.uuid();
            item.methodId = method.id;
            method.parameters.push(new Parameter(item));
            count++;
          }
        }
      }
    }
    this.snackBar.open(`粘贴${count}条成功`, '', {duration: 2000});
  }

  public delete(): void {
    const res = [];
    let count = 0;
    let tempType = this.clickType;
    if (tempType === 1) {
      for (const item of this.modifyDomain.classAttributes) {
        if (!item.isCheck) {
          res.push(item);
        } else {
          count++;
        }
      }
      this.modifyDomain.classAttributes = res;
    } else if (tempType === 2) {
      if(!!this.showMethodId){
        for (const item of this.modifyDomain.methods) {
          if (this.showMethodId === item.id) {
            for (const item2 of item.parameters) {
              if (!item2.isCheck) {
                tempType = 3
                res.push(item2);
              } else {
                count++;
              }
            }
            item.parameters = res;
            break;
          }
        }
      }
      if(tempType !== 3){
        for (const item of this.modifyDomain.methods) {
          if (!item.isCheck) {
            res.push(item);
          } else {
            count++;
          }
        }
        this.modifyDomain.methods = res;
      }
    }
    if (count === 0) {
      this.snackBar.open(`未选择`, '', {duration: 2000});
      return;
    }
    this.snackBar.open(`删除${count}条成功`, '', {duration: 2000});
  }
}
