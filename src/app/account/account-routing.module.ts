import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountComponent } from './account/account.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { AccountDetailsComponent } from './account-details/account-details.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      {path: '', component: AccountListComponent},
      {path: 'profile', component: AccountProfileComponent},
      {path: 'details', component: AccountDetailsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
