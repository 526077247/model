import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ContainerComponent} from './component/container/container.component';
import {PageNotFoundComponent} from './component/page-not-found/page-not-found.component';
import {LoginGuard} from './guard/login.guard';
import {HomeComponent} from './component/home/home.component';
import {LoginComponent} from './component/login/login.component';
import {DesignComponent} from './component/design/design.component';
import {ScriptComponent} from './component/script/script.component';
import {ScriptEditComponent} from './component/script/script-edit/script-edit.component';
import {HelpComponent} from './component/help/help.component';
import {RegisterComponent} from './component/register/register.component';

export const APP_ROUTING = [
  HomeComponent,
  LoginComponent,
  DesignComponent,
  ScriptComponent,
  PageNotFoundComponent,
  ContainerComponent,
  ScriptEditComponent,
  HelpComponent,
  RegisterComponent
];

const routes: Routes = [{
  path: '',
  component: ContainerComponent,
  children: [
    {path: '', component: HomeComponent},
    //{path: 'login', component: LoginComponent},
    //{path: 'register', component: RegisterComponent},
    {path: 'design', component: DesignComponent},
    {path: 'design/:id', component: DesignComponent},
    {path: 'script', component: ScriptComponent},
    {path: 'script/:id', component: ScriptComponent},
    {
      path: 'edit',
      canActivate: [LoginGuard],
      children: [
        {path: 'script', component: ScriptEditComponent},
        {path: 'script/:id', component: ScriptEditComponent},
      ]
    },
    {path: 'help', component: HelpComponent},
    {path: 'help/:type', redirectTo: 'help/:type/'},
    {path: 'help/:type/:step', component: HelpComponent},
    {path: '404', component: PageNotFoundComponent},
  ]
},
  {path: '**', redirectTo: '404'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
