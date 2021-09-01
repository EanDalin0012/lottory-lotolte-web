import { Component, OnInit, ViewChild } from '@angular/core';
import { BTN_ROLES } from '../../shares/constants/common.const';
import { FormGroup, FormBuilder, AbstractControl, Validators, FormControl } from '@angular/forms';
import { Account } from '../../shares/model/account';
import { PipeUtils } from '../../shares/utils/pipe-utils';
import { HTTPService } from '../../shares/services/http.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from '../../shares/services/modal.service';
import { UserInfomation } from '../../shares/model/user';
import { GeneratePasswordUtils } from '../../shares/utils/generate-password-util';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  private baseUrl: string = '';

  @ViewChild("userName") inputUserName: any;
  @ViewChild("password") inputPassword: any;

  modal: any;
  form: any;
  submitted = false;
  accountInfo: Account = {
    id: 0,
    accountID: '',
    accountName: '',
    accountBalance: 0,
    accountType: '',
    status:'',
    currency: ''
  };

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
    address: ''
  };

  currentAccount: string = '';

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
      password: ['', Validators.required]
    });

   }

  ngOnInit(): void {
    if(this.modal) {
      this.accountInfo = this.modal.message.accountInfo;
      console.log(this.accountInfo);
      this.currentAccount = PipeUtils.account(this.accountInfo.accountID) + '-'+ this.accountInfo.accountName;
      this.inquiryUserInfo();
    }
    this.form.patchValue({
      password: GeneratePasswordUtils.generate(8)
    });
  }

  close() {
    this.modal.close( {close: BTN_ROLES.CLOSE});
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
   }

  inquiryUserInfo() {
    const data = {
      id: this.accountInfo.id,
      accountID: this.accountInfo.accountID
    };

    const api = this.baseUrl + '/api/account/v0/inquiry/user-info';
    this.hTTPService.Post(api,data).then(resposne=> {
      if(resposne.result.responseCode === '200') {
        this.userInfo = resposne.body;
        this.form.patchValue({
          userName: this.userInfo.userName
        });
      } else {
        this.close();
      }
    });

  }

  isEmpty(code: string) {
    switch(code) {
      case 'password':
        this.form.patchValue({
          password: ''
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
    } else {
      const data = this.form.getRawValue();

      const updatePassword = {
        id: this.userInfo.id,
        userName: data.userName,
        password: data.password
      };

      const api = this.baseUrl + '/api/user/v0/reset-password';
      this.hTTPService.Post(api,updatePassword).then(resposne=> {

        if( resposne && resposne.result.responseCode !== '200') {
          this.translateErrorServer(resposne.result.responseMessage);
        }
        if(resposne.body != null && resposne.body.responseCode === '200') {
          this.close();
          this.translateErrorServer('PasswordReseted');
       }

     });

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
      case 'PasswordReseted':
          message = this.translateService.instant('Account.Message.PasswordReseted');
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
