import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {
  MatAutocompleteModule,
  MatButtonModule, MatCardModule,
  MatCheckboxModule, MatDividerModule, MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatMenuModule, MatOptionModule,
  MatRippleModule, MatSelectModule, MatSliderModule,
  MatSnackBarModule, MatTabsModule,
  MatTreeModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {DomainTreeComponent} from './component/design/domain-tree/domain-tree.component';
import {DomainDesignComponent} from './component/design/domain-design/domain-design.component';
import {NgZorroAntdModule, NZ_I18N, zh_CN} from 'ng-zorro-antd';
import {APP_ROUTING} from './app-routing.module';
import {CodemirrorModule} from 'ng2-codemirror';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {CodeTreeComponent} from './component/design/code-tree/code-tree.component';
import {SearchkeywordPipe} from './pipe/searchkeyword.pipe';
import {ScriptShopComponent} from './component/script/script-shop/script-shop.component';
import {ScriptManagerComponent} from './component/script/script-manager/script-manager.component';
import {DateformatPipe} from './pipe/dateformat.pipe';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import {PopoverModule} from 'ngx-bootstrap/popover';
import {MarkdownModule, MarkedOptions} from 'ngx-markdown';
import {HashLocationStrategy} from '@angular/common';
import { NzAffixModule } from 'ng-zorro-antd/affix';

@NgModule({
  declarations: [
    AppComponent,
    APP_ROUTING,
    DomainTreeComponent,
    DomainDesignComponent,
    CodeTreeComponent,
    SearchkeywordPipe,
    ScriptShopComponent,
    ScriptManagerComponent,
    DateformatPipe,

  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    AppRoutingModule,
    HttpClientModule,
    MarkdownModule.forRoot({
      loader: HttpClient, // optional, only if you use [src] attribute
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          gfm: true,
          tables: true,
          breaks: false,
          pedantic: false,
          sanitize: false,
          smartLists: true,
          smartypants: false,
        },
      }
    }),
    FormsModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatRippleModule,
    MatButtonModule,
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatTreeModule,
    MatInputModule,
    NgZorroAntdModule,
    CodemirrorModule,
    NgxJsonViewerModule,
    MatTabsModule,
    MatOptionModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatExpansionModule,
    ModalModule.forRoot(),
    MatMenuModule,
    MatSliderModule,
    DragDropModule,
    MatCardModule,
    MarkdownModule,
    NzAffixModule,
    MatDividerModule
  ],
  providers: [{
    provide: NZ_I18N, useValue: zh_CN,
    useClass: HashLocationStrategy
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}

