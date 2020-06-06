import {Component, OnInit} from '@angular/core';
import {BuildingScriptMgeSvr} from '../../service/building-script-mge.service';
import {LoginAuthorService} from '../../service/login-author.service';
import {DataList} from '../../domain/datalist.domain';
import {BuildingScript} from 'src/app/domain/buildingscript.domain';
import {FavoriteScriptMgeSvr} from '../../service/favorite-script-mge.service';
import {FavoriteScript} from '../../domain/favoritescript.domain';
import {FormControl} from '@angular/forms';
import {TYPE_TABS} from 'src/app/domain/global.enum';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-script',
  templateUrl: './script.component.html',
  styleUrls: ['./script.component.less']
})
export class ScriptComponent implements OnInit {

  public selected = new FormControl(0); // 展示的tab序号
  public get TYPE_TABS() {
    return TYPE_TABS;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    router.events.subscribe(Event => {
      if (Event instanceof NavigationEnd) {
        const type = Number.parseInt(this.route.snapshot.paramMap.get('id'), 10);
        if (!isNaN(type)) {
          this.selected.setValue(type);
        }
      }
    });
  }

  ngOnInit() {

  }

  /**
   * 跳转页面
   * @param id tab编号
   */
  public goLocation(id: number): void {
    if (id >= 2) {
      this.router.navigateByUrl('/edit/script/');
    } else {
      this.router.navigateByUrl('/script/' + id);
    }
  }

}
