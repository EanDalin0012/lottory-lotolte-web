import { Component, OnInit, ViewChild } from '@angular/core';
import { UserInfomation } from '../../shares/model/user';
import { TranslateService } from '@ngx-translate/core';
import { HTTPService } from '../../shares/services/http.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ModalService } from '../../shares/services/modal.service';
import { environment } from 'src/environments/environment';
import { GeneratePasswordUtils } from '../../shares/utils/generate-password-util';
import { BTN_ROLES } from '../../shares/constants/common.const';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  private baseUrl: string = '';

  @ViewChild("userName") inputUserName: any;
  @ViewChild("password") inputPassword: any;
  @ViewChild("confirmPassword") inputConfirmPassword: any;

  modal: any;
  form: any;
  submitted = false;

  userInfo: UserInfomation = {
    id: 0,
    firstName: '',
    lastName:'',
    userName: '',
    dateBirth: '',
    gender:'',
    resourceID: 0,
    phoneNumber: '',
    otherPhoneNumber: '',
    createDate: '',
    address: '',
    isFirstLogin: ''
  };


  constructor(
    private translateService: TranslateService,
    private hTTPService: HTTPService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
  ) {
    this.baseUrl = environment.bizServer.server;
    this.form as FormGroup;

    this.form = this.formBuilder.group({
      userName: [{value: '', disabled: true}, Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

   }

  ngOnInit(): void {
    if(this.modal) {
      this.userInfo = this.modal.message;
      console.log(this.userInfo);
      this.form.patchValue({
        userName: this.userInfo.userName
      });
    }
  }

  close() {
    this.modal.close( {close: BTN_ROLES.CLOSE});
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
   }

  isEmpty(code: string) {
    switch(code) {
      case 'password':
        this.form.patchValue({
          password: ''
        });
        break;
      case 'confirmPassword':
        this.form.patchValue({
          confirmPassword: ''
        });
        break;
    }
  }

  save() {
    this.submitted = true;
    if(this.f.userName.errors) {
      this.inputUserName.nativeElement.focus();
    } else if (this.f.password.errors) {
      this.inputPassword.nativeElement.focus();
    } else if (this.f.confirmPassword.errors) {
      this.inputConfirmPassword.nativeElement.focus();
    } else {
      const data = this.form.getRawValue();
      if (data.password != data.confirmPassword) {
        this.translateErrorServer('Password_Not_Match');
      } else {
        const updatePassword = {
          id: this.userInfo.id,
          userName: data.userName,
          password: data.password
        };

        const api = this.baseUrl + '/api/user/v0/change-password';
        this.hTTPService.Post(api,updatePassword).then(resposne=> {

          if( resposne && resposne.result.responseCode !== '200') {
            this.translateErrorServer(resposne.result.responseMessage);
          }
          if(resposne.body != null && resposne.body.responseCode === '200') {
            this.close();
            this.translateErrorServer('PasswordChanged');
         }

       });
      }


    }
  }

  translateErrorServer(tran: string) {
    let message = '';

    switch(tran) {
      case 'Invalid_UserName':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_UserName');
        break;
      case 'Invalid_Password':
        message = this.translateService.instant('Account.Message.PasswordRequired');
        break;
      case 'Invalid_ConfirmPassword':
          message = this.translateService.instant('Account.Message.ConfirmPasswordRequired');
          break;
      case 'Password_Not_Match':
        message = this.translateService.instant('Account.Message.PasswordNotMatch');
        break;
      case 'PasswordChanged':
        message = this.translateService.instant('Account.Message.PasswordChanged');
        break;
      case '500':
        message = this.translateService.instant('ServerResponseCode.Label.Server_Error');
        break;
    }
    this.modalService.alert(
      message,
     {
     modalClass: 'open-alert',
     btnText: this.translateService.instant('Common.Button.Confirme'),
     callback: res => {

     }
   });

  }

}
