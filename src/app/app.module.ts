
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
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Utils } from './shares/utils/utils.static';
import { LOCAL_STORAGE } from './shares/constants/common.const';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    MlayoutComponent,
    LayoutBlankComponent,
    Error404Component,
    Error405Component
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

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private deviceService: DeviceDetectorService) {
    Utils.setSecureStorage(LOCAL_STORAGE.DEVICE_INFO, this.deviceService.getDeviceInfo());
  }
 }
