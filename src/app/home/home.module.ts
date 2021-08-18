import { HomeRoutingModule } from './home-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { Home100Component } from './home100/home100.component';
import { Home110Component } from './home110/home110.component';
import { Home111Component } from './home111/home111.component';
import { Home200Component } from './home200/home200.component';
import { Home210Component } from './home210/home210.component';
import { Home230Component } from './home230/home230.component';
import { MshareModule } from '../shares/mshare/mshare.module';

@NgModule({
  declarations: [
    HomeComponent,
    Home100Component,
    Home110Component,
    Home111Component,
    Home200Component,
    Home210Component,
    Home230Component
  ],
  imports: [
    HomeRoutingModule,
    CommonModule,
    MshareModule
  ],
  // exports: [
  //   FormsModule,
  //   ReactiveFormsModule,
  //   TranslateModule,
  //   InputsModule,
  //   ChartsModule,
  //   DateInputsModule,
  //   DialogsModule,
  //   DropDownsModule,
  //   ExcelExportModule,
  //   GridModule,
  //   LayoutModule,
  //   NotificationModule,
  //   PDFExportModule,
  //   PopupModule,
  //   ProgressBarModule,
  //   SchedulerModule,
  //   ScrollViewModule,
  //   SortableModule,
  //   TooltipModule,
  //   UploadModule,
  // ]
})
export class HomeModule { }
