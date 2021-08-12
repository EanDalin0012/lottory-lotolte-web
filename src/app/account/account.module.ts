import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account/account.component';
import { AccountListComponent } from './account-list/account-list.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { EditAccountComponent } from './edit-account/edit-account.component';



@NgModule({
  declarations: [
    AccountComponent,
    AccountListComponent,
    AddAccountComponent,
    EditAccountComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AccountModule { }
