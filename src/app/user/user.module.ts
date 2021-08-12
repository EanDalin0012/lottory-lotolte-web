import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserProfileComponent } from './user-profile/user-profile.component';



@NgModule({
  declarations: [
    AddUserComponent,
    EditUserComponent,
    UserListComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
