import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizationComponent } from './authorization/authorization.component';
import { LoginComponent } from './login/login.component';
import { AuthorizationRoutingModule } from './authorization-routing.module';
import { MshareModule } from '../shares/mshare/mshare.module';
import { ChangePasswordComponent } from './change-password/change-password.component';



@NgModule({
  declarations: [
    AuthorizationComponent,
    LoginComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    AuthorizationRoutingModule,
    MshareModule

  ]
})
export class AuthorizationModule { }
