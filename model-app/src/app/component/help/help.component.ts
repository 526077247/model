import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {HelpService} from 'src/app/service/help.service';
import {HelpMenu} from '../../domain/helpmenu.domain';
import {Title} from '@angular/platform-browser';

// declare var $: any;

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.less']
})
export class HelpComponent implements OnInit {
  public content: string;
  public type: string;
  public step: string;
  public menulist: HelpMenu[] = [];

  // public body: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private helpService: HelpService,
    private titleService: Title,
  ) {
    router.events.subscribe(Event => {
      if (Event instanceof NavigationEnd) {
        this.type = this.route.snapshot.paramMap.get('type');
        this.step = this.route.snapshot.paramMap.get('step');
      }
    });
  }

  ngOnInit() {
    this.titleService.setTitle('指南');
    this.helpService.GetMenu().then(res => {
      this.menulist = res;
      // this.body = (window.opener) ? (document.compatMode === 'CSS1Compat' ? $('html') : $('body')) : $('html,body');
      this.changePosition();
    });
  }

  /**
   * 取类型名
   * @param type 类型代码
   */
  public getTypeName(type: string): string {
    if (!this.type) {
      return '帮助';
    }
    for (const item of this.menulist) {
      if (item.type === this.type) {
        return item.name;
      }
    }
    return '帮助';
  }

  /**
   * 调到锚点
   */
  public changePosition(): void {
    setTimeout(() => {
      if (!!this.step) {
        // this.body.animate({scrollTop: $('#' + this.step).offset().top}, 1000);
        let top = document.getElementById(this.step);
        if (top != null) {

          top.scrollIntoView();
          top = null;
        }
      }
    });
  }
}
