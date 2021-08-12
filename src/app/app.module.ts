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
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    MlayoutComponent,
    LayoutBlankComponent,
    Error404Component,
    Error405Component
  ],
  imports: [
    BrowserModule,
    MLayoutModule,
    AppRoutingModule,
    MshareModule.forRoot(),
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
