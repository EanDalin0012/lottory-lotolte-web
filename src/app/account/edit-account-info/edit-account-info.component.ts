import { Component, OnInit, ViewChild } from '@angular/core';
import { BTN_ROLES, Genders } from '../../shares/constants/common.const';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ModalService } from '../../shares/services/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { HTTPService } from '../../shares/services/http.service';
import { Account } from '../../shares/model/account';
import { PipeUtils } from '../../shares/utils/pipe-utils';

@Component({
  selector: 'app-edit-account-info',
  templateUrl: './edit-account-info.component.html',
  styleUrls: ['./edit-account-info.component.css']
})
export class EditAccountInfoComponent implements OnInit {

  private baseUrl: string = '';

  @ViewChild("accountName") inputAccountName: any;
  @ViewChild("accountID") inputAccountID: any;
  @ViewChild("accountBalance") inputAccountBalance: any;

  modal:any;

  form: any;

  submitted = false;
  genderCheck = false;

  dateBirth: Date = new Date();
  account:Account = {
    id: 0,
    accountID: '',
    accountName:'',
    accountBalance: 0,
    currency: '',
    accountType: '',
    status: '',
  };

  gender = {
    code: '',
    text: '',
  };
  defaultGender = {
    code: '',
    text: 'Select Gender',
  }
  genders = Genders;

  constructor(
    private translateService: TranslateService,
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private hTTPService: HTTPService
  ) {
    this.baseUrl = environment.bizServer.server;

    this.form as FormGroup;

    this.form = this.formBuilder.group({
      accountName: [ '', Validators.required],
      accountID: [{value: '', disabled: true}, Validators.required],
      accountBalance: [{value: '', disabled: true}, Validators.required],
    });
  }

  ngOnInit(): void {
    if(this.modal) {
      this.account = this.modal.message;
      this.form.patchValue({
        accountName: this.account.accountName,
        accountID: PipeUtils.account(this.account.accountID),
        accountBalance: PipeUtils.accountBalance(this.account.accountBalance, this.account.currency) + ' '+ this.account.currency
      });
    }

  }

  close() {
    this.modal.close( {close: BTN_ROLES.CLOSE});
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onChangeGender(event: any) {
    if(event.code == '') {
      this.genderCheck = true;
    } else {
      this.genderCheck = false;
    }

  }

  isEmpty(code: string) {
    switch(code) {
      case 'accountName':
        this.form.patchValue({
          firstName: ''
        });
        break;
    }
  }

  save() {
    this.submitted = true;
    if(this.f.accountID.errors) {
      this.inputAccountID.nativeElement.focus();
    } else if (this.f.accountName.errors) {
      this.inputAccountName.nativeElement.focus();
    } else if (this.f.accountBalance.errors) {
      this.inputAccountBalance.nativeElement.focus();
    } else {
      const data = this.form.getRawValue();

      const accountInformation = {
        accountName: data.accountName,
        accountID: this.account.accountID,
        id: this.account.id
      };

      const api = this.baseUrl + '/api/account/v0/update/accountName';
      this.hTTPService.Post(api,accountInformation).then((resposne)=> {
        if( resposne && resposne.result.responseCode !== '200') {
          this.translateErrorServer(resposne.result.responseMessage);
        }
        if(resposne.body != null && resposne.body.responseCode === '200') {
          this.modal.close( {close: BTN_ROLES.CLOSE, responseCode: resposne.body.responseCode, accountInfo: accountInformation});
       }

     });

    }
  }

  translateErrorServer(tran: string) {
    let message = '';

    switch(tran) {
      case 'Invalid_FirstName':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_FirstName');
        break;
      case 'Invalid_LastName':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_LastName');
        break;
      case 'Invalid_Password':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_Password');
        break;
      case 'Invalid_Gender':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_Gender');
        break;
      case 'Invalid_DB':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_DB');
        break;
      case 'Invalid_UserName':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_UserName');
        break;
      case 'Invalid_AccountType':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_AccountType');
        break;
      case 'Invalid_Currency':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_Currency');
        break;
      case 'Invalid_MainAccountID':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_MainAccountID');
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
