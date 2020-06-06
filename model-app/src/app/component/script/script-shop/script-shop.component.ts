import {Component, OnInit} from '@angular/core';
import {DataList} from '../../../domain/datalist.domain';
import {BuildingScript} from '../../../domain/buildingscript.domain';
import {FavoriteScript} from '../../../domain/favoritescript.domain';
import {BuildingScriptMgeSvr} from '../../../service/building-script-mge.service';
import {FavoriteScriptMgeSvr} from '../../../service/favorite-script-mge.service';
import {LoginAuthorService} from '../../../service/login-author.service';
import {TYPE_SCRIPT} from '../../../domain/global.enum';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-script-shop',
  templateUrl: './script-shop.component.html',
  styleUrls: ['./script-shop.component.less']
})
export class ScriptShopComponent implements OnInit {
  public scripts: DataList<BuildingScript> = new DataList<BuildingScript>();
  public favoriteScripts: FavoriteScript[] = [];
  public pageNow: number;
  public pageCount: number;
  public pageSize: number;
  public scriptTypes: any[] = [];
  public selectType: number;
  public selectDays: number;
  public fStr: string;
  public isLoading: boolean;

  public get TYPE_SCRIPT() {
    return TYPE_SCRIPT;
  }

  constructor(
    private scriptMgeSvr: BuildingScriptMgeSvr,
    private favoriteScriptMgeSvr: FavoriteScriptMgeSvr,
    private loginAuthorService: LoginAuthorService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.getTypes();
  }

  ngOnInit() {
    this.pageSize = 20;
    this.pageNow = 1;
    this.isLoading = true;
    this.getFavoriteScripts();
  }

  /**
   * 获取脚本列表
   */
  public getScripts(typein = ''): void {
    this.checkPage();
    this.scriptMgeSvr.QueryList('', typein, (this.pageNow - 1) * this.pageSize, this.pageSize).then(res => {
      this.scripts = res;
      this.pageCount = Math.ceil(this.scripts.total / this.pageSize);
      this.checkPage();
      this.isLoading = false;
    });
  }

  /**
   * 获取收藏脚本
   */
  public getFavoriteScripts(): void {
    this.favoriteScriptMgeSvr.QueryList(this.loginAuthorService.token, 0, -1).then(res => {
      this.favoriteScripts = res.list;
      this.getFStr();
      this.getScripts();
    });
  }

  /**
   * 添加收藏脚本
   */
  public addFavoriteScript(item: BuildingScript): void {
    if (this.fStr.indexOf(item.id) >= 0) {
      for (let i = 0; i < this.favoriteScripts.length; i++) {
        const script = this.favoriteScripts[i];
        if (script.scriptId === item.id) {
          this.favoriteScriptMgeSvr.Delete(this.loginAuthorService.token, script.id).then(res => {
            if (res > 0) {
              this.favoriteScripts.splice(i, 1);
              this.getFStr();
              this.snackBar.open('取消订阅成功', '', {duration: 2000});
            } else {
              this.snackBar.open('取消订阅失败', '', {duration: 2000});
            }
          }, err => {
            this.snackBar.open('取消订阅失败', '', {duration: 2000});
          });
          return;
        }
      }
      this.snackBar.open('取消订阅失败', '', {duration: 2000});
    } else {
      this.favoriteScriptMgeSvr.Add(this.loginAuthorService.token, item.id).then(res => {
        this.favoriteScripts.push(res);
        this.getFStr();
        this.snackBar.open('订阅成功', '', {duration: 2000});
      }, err => {
        this.snackBar.open('订阅失败', '', {duration: 2000});
      });
    }
  }

  /**
   * 取收藏脚本id字符串
   */
  private getFStr(): void {
    let res = '';
    for (const item of this.favoriteScripts) {
      res += item.scriptId + ',';
    }
    this.fStr = res;
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

  /**
   * 加载脚本页面
   * @param item 脚本id
   */
  public loadScript(item: string): void {
    this.router.navigateByUrl('/edit/script/' + item);
  }

  /**
   * 选择类型
   * @param type 类型
   */
  public chooseType(type: number): void {
    this.pageNow = 1;
    this.getScripts(type.toString());
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
