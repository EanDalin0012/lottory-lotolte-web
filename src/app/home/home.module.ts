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
import { InputsModule } from '@progress/kendo-angular-inputs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ChartsModule } from '@progress/kendo-angular-charts';
import 'hammerjs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { PopupModule } from '@progress/kendo-angular-popup';
import { ProgressBarModule } from '@progress/kendo-angular-progressbar';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { ScrollViewModule } from '@progress/kendo-angular-scrollview';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { UploadModule } from '@progress/kendo-angular-upload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


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
