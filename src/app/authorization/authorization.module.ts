import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizationComponent } from './authorization/authorization.component';
import { LoginComponent } from './login/login.component';



@NgModule({
  declarations: [
    AuthorizationComponent,
    LoginComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AuthorizationModule { }
