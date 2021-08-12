import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report/report.component';
import { ReportListComponent } from './report-list/report-list.component';



@NgModule({
  declarations: [
    ReportComponent,
    ReportListComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ReportModule { }
