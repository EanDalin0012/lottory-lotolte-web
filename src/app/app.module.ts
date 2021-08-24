
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MshareModule } from './shares/mshare/mshare.module';
import { MlayoutComponent } from './layout/mlayout/mlayout.component';
import { LayoutBlankComponent } from './layout/layout-blank/layout-blank.component';
import { MLayoutModule } from './layout/layout.module';
import { Error404Component } from './error/error404/error404.component';
import { Error405Component } from './error/error405/error405.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Utils } from './shares/utils/utils.static';
import { LOCAL_STORAGE } from './shares/constants/common.const';
import { InvalidControlScrollContainerDirective } from './shares/directive/invalid-control-scroll-container.directive';
import { InvalidControlScrollDirective } from './shares/directive/invalid-control-scroll.directive';
import { JsonipService } from './shares/services/jsonip.service';
import { AuthInterceptor } from './shares/services/auth.interceptor';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    MlayoutComponent,
    LayoutBlankComponent,
    Error404Component,
    Error405Component,
    InvalidControlScrollContainerDirective,
    InvalidControlScrollDirective
  ],
  imports: [
    MLayoutModule,
    AppRoutingModule,
    MshareModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
    }),
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    BrowserModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private deviceService: DeviceDetectorService,
    private jsonipService: JsonipService
    ) {
      this.jsonipService.jsonIp().then((result) => {
        Utils.setSecureStorage(LOCAL_STORAGE.NekWorkIP, result);
      }).catch((err) => {

      });
    Utils.setSecureStorage(LOCAL_STORAGE.DEVICE_INFO, this.deviceService.getDeviceInfo());
    //Utils.setSecureStorage(LOCAL_STORAGE.NekWorkIP, );
  }
 }
