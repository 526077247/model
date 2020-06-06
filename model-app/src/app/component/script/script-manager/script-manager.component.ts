import {Component, OnInit} from '@angular/core';
import {BuildingScriptMgeSvr} from '../../../service/building-script-mge.service';
import {LoginAuthorService} from '../../../service/login-author.service';
import {DataList} from '../../../domain/datalist.domain';
import {BuildingScript} from '../../../domain/buildingscript.domain';
import {TYPE_SCRIPT} from '../../../domain/global.enum';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-script-manager',
  templateUrl: './script-manager.component.html',
  styleUrls: ['./script-manager.component.less']
})
export class ScriptManagerComponent implements OnInit {
  public scripts: DataList<BuildingScript> = new DataList<BuildingScript>();
  public pageNow: number;
  public pageCount: number;
  public pageSize: number;
  public deleteScript: BuildingScript;
  public isLoading: boolean;

  public get nowPath(): string {
    return encodeURIComponent(window.location.pathname);
  }

  public get TYPE_SCRIPT() {
    return TYPE_SCRIPT;
  }

  constructor(
    private scriptMgeSvr: BuildingScriptMgeSvr,
    private loginAuthorService: LoginAuthorService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.pageSize = 20;
    this.pageNow = 1;
    this.getScripts();
  }

  /**
   * 获取脚本列表
   */
  public getScripts(): void {
    this.checkPage();
    this.scriptMgeSvr.QueryMyList(this.loginAuthorService.token, '', (this.pageNow - 1) * this.pageSize, this.pageSize).then(res => {
      this.scripts = res;
      this.pageCount = Math.ceil(this.scripts.total / this.pageSize);
      this.checkPage();
      this.isLoading = false;
    });
  }

  /**
   * 获取详情
   */
  public getContent(item: BuildingScript): void {
    if (!item.content) {
      item.isLoading = true;
      this.scriptMgeSvr.Get(this.loginAuthorService.token, item.id).then(res => {
        item.content = res.content;
        item.isLoading = false;
      });
    }
  }

  /**
   * 删除脚本
   */
  public delete(): void {
    this.scriptMgeSvr.Delete(this.loginAuthorService.token, this.deleteScript.id).then(res => {
      if (res > 0) {
        this.snackBar.open('删除成功', '', {duration: 2000});
        this.getScripts();
      } else {
        this.snackBar.open('删除失败', '', {duration: 2000});
      }
    });
  }

  /**
   * 跳转页面
   * @param item 脚本
   */
  public goLocation(item: BuildingScript) {
    this.router.navigateByUrl('/edit/script/' + item.id + '?redirect_url=' + this.nowPath);
  }

  /*
  * 计算要展示的页码列表
  * */
  public getShowNum(): number[] {
    const result = [];
    let start = this.pageNow - 4;
    let end = this.pageNow + 4;
    if (this.pageCount > 9) {
      if (end > this.pageCount) {
        start = this.pageCount - 9;
        end = this.pageCount;
      } else if (start < 1) {
        start = 1;
        end = 9;
      }
    } else {
      start = 1;
      end = this.pageCount;
    }
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  }


  /*
   * 跳转页面
   * */
  public changePage(n: number): void {
    this.pageNow = n;
    this.getScripts();
  }

  /*
  * 检测页码是否超出界限
  * */
  private checkPage(): void {
    if (this.pageCount < 1) {
      this.pageCount = 1;
    }
    if (this.pageNow < 1) {
      this.pageNow = 1;
    }
    if (this.pageNow > this.pageCount) {
      this.pageNow = this.pageCount;
    }
  }
}
