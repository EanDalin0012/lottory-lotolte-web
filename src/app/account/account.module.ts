import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account/account.component';
import { AccountListComponent } from './account-list/account-list.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { MshareModule } from '../shares/mshare/mshare.module';
import { AccountRoutingModule } from './account-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { DataTablesModule } from 'angular-datatables';
import { AccountProfileComponent } from './account-profile/account-profile.component';



@NgModule({
  declarations: [
    AccountComponent,
    AccountListComponent,
    AddAccountComponent,
    EditAccountComponent,
    AccountProfileComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MshareModule,
    DataTablesModule
  ]
})
export class AccountModule { }
