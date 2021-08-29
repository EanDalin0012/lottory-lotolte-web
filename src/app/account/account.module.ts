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
import { AccountDepositComponent } from './account-deposit/account-deposit.component';
import { AccountWithdrawalComponent } from './account-withdrawal/account-withdrawal.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { SubAccountComponent } from './sub-account/sub-account.component';
import { ViewAccountComponent } from './view-account/view-account.component';
import { SubAccountMasterComponent } from './sub-account-master/sub-account-master.component';
import { SubAccountAgentComponent } from './sub-account-agent/sub-account-agent.component';
import { SubAccountMemberComponent } from './sub-account-member/sub-account-member.component';
import { ShowAddAccountComponent } from './show-add-account/show-add-account.component';



@NgModule({
  declarations: [
    AccountComponent,
    AccountListComponent,
    AddAccountComponent,
    EditAccountComponent,
    AccountProfileComponent,
    AccountDepositComponent,
    AccountWithdrawalComponent,
    AccountDetailsComponent,
    MyAccountComponent,
    AccountSettingComponent,
    SubAccountComponent,
    ViewAccountComponent,
    SubAccountMasterComponent,
    SubAccountAgentComponent,
    SubAccountMemberComponent,
    ShowAddAccountComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MshareModule,
    DataTablesModule
  ]
})
export class AccountModule { }
