import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account/account.component';
import { AccountListComponent } from './account-list/account-list.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { MshareModule } from '../shares/mshare/mshare.module';
import { AccountRoutingModule } from './account-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { SubAccountComponent } from './sub-account/sub-account.component';
import { ViewAccountComponent } from './view-account/view-account.component';
import { SubAccountMasterComponent } from './sub-account-master/sub-account-master.component';
import { SubAccountAgentComponent } from './sub-account-agent/sub-account-agent.component';
import { SubAccountMemberComponent } from './sub-account-member/sub-account-member.component';
import { ShowAddAccountComponent } from './show-add-account/show-add-account.component';
import { EditPersonalInfoComponent } from './edit-personal-info/edit-personal-info.component';
import { EditAccountInfoComponent } from './edit-account-info/edit-account-info.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AccountDepositMoneyComponent } from './account-deposit-money/account-deposit-money.component';
import { AccountWithdrawalCashOutComponent } from './account-withdrawal-cash-out/account-withdrawal-cash-out.component';



@NgModule({
  declarations: [
    AccountComponent,
    AccountListComponent,
    AddAccountComponent,
    EditAccountComponent,
    AccountProfileComponent,
    AccountDetailsComponent,
    MyAccountComponent,
    AccountSettingComponent,
    SubAccountComponent,
    ViewAccountComponent,
    SubAccountMasterComponent,
    SubAccountAgentComponent,
    SubAccountMemberComponent,
    ShowAddAccountComponent,
    EditPersonalInfoComponent,
    EditAccountInfoComponent,
    ResetPasswordComponent,
    AccountDepositMoneyComponent,
    AccountWithdrawalCashOutComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MshareModule,
    DataTablesModule
  ]
})
export class AccountModule { }
