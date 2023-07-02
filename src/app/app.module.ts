import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  CommonModule,
  LocationStrategy,
  HashLocationStrategy
} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastrModule} from 'ngx-toastr';

import {FullComponent} from './shared/layouts/full/full.component';
import {BlankComponent} from './shared/layouts/blank/blank.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {NavigationComponent} from './shared/header-navigation/navigation.component';
import {SidebarComponent} from './shared/sidebar/sidebar.component';

import {Approutes} from './app-routing.module';
import {AppComponent} from './app.component';

import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PERFECT_SCROLLBAR_CONFIG} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 1,
  wheelPropagation: true,
  minScrollbarLength: 20
};
import {MomentModule} from 'ngx-moment';
import {JwtInterceptor} from './_interceptors/jwt.interceptor';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ApiService} from './shared/services/api.service';
import {Endpoints} from './shared/endpoints';

import {LOCALE_ID} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {NgxSpinnerModule} from 'ngx-spinner';
import {DataTablesModule} from 'angular-datatables';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {DialogModalComponent} from './shared/services/_modal/dialog-modal/dialog-modal.component';
import {DialogService} from './shared/services/_modal/dialog.service';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    BlankComponent,
    NavigationComponent,
    SidebarComponent,
    LandingPageComponent,
    DialogModalComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(Approutes),
    Ng2SearchPipeModule,
    NgMultiSelectDropDownModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
      defaultLanguage: 'us'
    }),
    MomentModule.forRoot({
      relativeTimeThresholdOptions: {
        'm': 59
      }
    }),
    NgxSpinnerModule,
    DataTablesModule,
    ReactiveFormsModule,
    PerfectScrollbarModule
  ],
  providers: [
    // {provide: LOCALE_ID, useValue: 'de-DE'},
    Endpoints,
    ApiService,
    DialogService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
