import { ModuleWithProviders, NgModule } from '@angular/core';
import { InputsModule } from '@progress/kendo-angular-inputs';
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
import { UploadModule, UploadsModule } from '@progress/kendo-angular-upload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ModalComponent } from '../component/modal/modal.component';
import { AccountPipe } from '../pipe/account.pipe';
import { AccountStatusPipe } from '../pipe/account-status.pipe';
import { AccountTypePipe } from '../pipe/account-type.pipe';
import {NgxScrollToFirstInvalidModule} from '@ismaestro/ngx-scroll-to-first-invalid';
@NgModule({
  declarations: [
    ModalComponent,
    AccountPipe,
    AccountStatusPipe,
    AccountTypePipe
  ],
  imports: [
    // InputsModule,
    // ButtonsModule,
    // ChartsModule,
    // DateInputsModule,
    // DialogsModule,
    // DropDownsModule,
    // ExcelExportModule,
    // GridModule,
    // LayoutModule,
    // NotificationModule,
    // PDFExportModule,
    // PopupModule,
    // ProgressBarModule,
    // SchedulerModule,
    // ScrollViewModule,
    // SortableModule,
    // TooltipModule,
    // UploadModule,
    NgxScrollToFirstInvalidModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    InputsModule,
    ButtonsModule,
    ChartsModule,
    DateInputsModule,
    DialogsModule,
    DropDownsModule,
    ExcelExportModule,
    GridModule,
    LayoutModule,
    NotificationModule,
    PDFExportModule,
    PopupModule,
    ProgressBarModule,
    SchedulerModule,
    ScrollViewModule,
    SortableModule,
    TooltipModule,
    UploadModule,
    UploadsModule,
    // pipe
    AccountPipe,
    AccountStatusPipe,
    AccountTypePipe
  ],
  entryComponents: [
    ModalComponent,
  ],
})
export class MshareModule {
  static forRoot(): ModuleWithProviders<MshareModule> {
    return {
      ngModule: MshareModule,
      providers: []
    };
  }
 }
