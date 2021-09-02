import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../shares/services/data.service';
import { AuthentcatiionService, AuthentcatiionRequest } from '../../shares/services/authentcatiion.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ModalService } from '../../shares/services/modal.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitted = false;
  @ViewChild("userName") inputUserName: any;
  @ViewChild("password") inputPassword: any;
  isFirstLogin = false;

  formLogin: any;
  constructor(
    private dataService: DataService,
    private authentcatiionService: AuthentcatiionService,
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    ) {
      this.formLogin as FormGroup;
      this.inputUserName as ElementRef;
      this.inputPassword as ElementRef;

      this.formLogin = this.formBuilder.group({
        userName: ['', Validators.required],
        password: ['', Validators.required]
      });
    }

  ngOnInit(): void {
    this.formLogin.patchValue({
      userName: 'admin@gmail.com',
      password: 'admin123'
    });
  }

  routors() {
    this.router.navigate(['/acc/my-account']);
  }

  isEmpty(value: string) {
    switch (value) {
      case 'u':
        this.formLogin.patchValue({
          userName: '',
        });
        break;
      case 'p':
        this.formLogin.patchValue({
          password: '',
        });
        break;
    }
  }

  onLogin() {
    this.submitted = true;
    if(this.f.userName.errors) {
      this.inputUserName.nativeElement.focus();
    } else if (this.f.password.errors) {
      this.inputPassword.nativeElement.focus();
    } else {
      const formData = this.formLogin.getRawValue();
      const logInfo: AuthentcatiionRequest = {
        user_name: formData.userName,
        password: formData.password
      };
      this.authentcatiionService.login(logInfo).then((result: any) => {
        if(result) {
          console.log(result);
          this.isFirstLogin = result.userInfo.isFirstLogin;
          if(this.isFirstLogin == false) {
            this.routors();
          } else {
            this.changePassword(result.userInfo);
          }
          console.log(this.isFirstLogin);
          // this.routors();
        }
      }).catch((err: any) => {
          console.log(err);
      });
    }

  }

  get f(): { [key: string]: AbstractControl } {
    return this.formLogin.controls;
  }

  changePassword(item: any) {
    this.modalService.open(
      ChangePasswordComponent,
      {
        message: item,
        callback: _response => {

      }
    });
  }
}
