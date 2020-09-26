import {Injectable} from '@angular/core';


import {CookieUtil} from '../share/class/cookie';
import {LoginResult} from '../domain/loginresult.domain';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';


const SESSION_NAME = '_MytModel_Session_Token_Info_';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthorService {

  cookie = new CookieUtil();

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  get userInfo() {
    const res = new LoginResult(JSON.parse(this.cookie.cookie(SESSION_NAME) || '{}'));
    if (!res.Token) {
      // this.router.navigateByUrl('/login?redirect_url=' + encodeURIComponent(window.location.pathname));
      window.location.href="/api/auth2login.midw?redirectUrl="+window.location.href;
    }
    return res;
  }

  get token(): string {
    return this.userInfo.Token;
  }

  get isLogin(): boolean {
    const res = new LoginResult(JSON.parse(this.cookie.cookie(SESSION_NAME) || '{}'));
    return !!res.Token;
  }

  login(username: string, password: string): void {
    // this.authorizeSvr.Login(username, password).then(res => {
    //   if (res.Token) {
    //     this.cookie.cookie(SESSION_NAME, JSON.stringify(res), {path: '/', expires: res.Effective});
    //     this.activatedRoute.queryParams.subscribe(queryParam => {
    //       if (window.location.pathname === '/login') {
    //         if (!!queryParam.redirect_url) {
    //           this.router.navigateByUrl(decodeURIComponent(queryParam.redirect_url));
    //         } else {
    //           this.router.navigateByUrl('/');
    //         }
    //         this.snackBar.open('登录成功', '', {duration: 2000});
    //       }
    //     });
    //   } else {
    //     this.snackBar.open('登录失败', '', {duration: 2000});
    //   }
    // }, err => {
    //   this.snackBar.open('登录失败', '', {duration: 2000});
    // });
  }

  logout(): boolean {
    this.cookie.cookie(SESSION_NAME, "", { path: '/', expires: 0 });
    this.router.navigateByUrl('/');
    return true;



  }

}
