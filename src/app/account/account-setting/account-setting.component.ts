import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountStatus } from 'src/app/shares/constants/common.const';
import { StatusAccount } from '../../shares/model/account-status';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { Utils } from '../../shares/utils/utils.static';
import { Account } from 'src/app/shares/model/account';
import { PipeUtils } from '../../shares/utils/pipe-utils';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModalService } from '../../shares/services/modal.service';
import { HTTPService } from '../../shares/services/http.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit {

  private baseUrl: string = '';

  @ViewChild("accountName") inputAccountName: any;

  accountBalaceDisplay = '';
  remark: string = '';
  accountStatus: StatusAccount[] = [];
  otherStatus = false;
  status: StatusAccount = {
    text: '',
    value: ''
  };
  defaultAccountStatus:StatusAccount = {
    text: this.translateService.instant('Account.Label.SelectAccountStatus'),
    value: ''
  };
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };

  submitted = false;
  form: any;
  accountInfo: Account = {
    id: 0,
    accountID: '',
    accountName: '',
    accountBalance: 0,
    accountType: '',
    status:'',
    currency: ''
  };
  constructor(
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private hTTPService: HTTPService,
    private router: Router,
  ) {
    this.baseUrl = environment.bizServer.server;
    this.form as FormGroup;

    this.accountStatus = [
      {
        text: 'Active',
        value: AccountStatus.Active
      },
      {
        text: 'Inactive',
        value: AccountStatus.Inactive
      }
    ];

    this.form = this.formBuilder.group({
      accountName: ['', Validators.required],
      accountID: [{value: '', disabled: true}, Validators.required],
      accountBalace: [{value: '', disabled: true}, Validators.required],
      status: new FormControl(),
      remark: ['']
    });

   }

  ngOnInit(): void {
    this.accountInfo = Utils.getSecureStorage('account-setting') as Account;

    this.form.patchValue({
      accountName: this.accountInfo.accountName,
      accountID: PipeUtils.account(this.accountInfo.accountID),
      accountBalace: PipeUtils.accountBalance(this.accountInfo.accountBalance, this.accountInfo.currency) + ' ' + this.accountInfo.currency
    });
    this.checkStatus(this.accountInfo.status);
  }

  onChangeStatus(event: any) {
    this.otherStatus = false;
    if(event.value == this.defaultAccountStatus.value) {
      this.otherStatus = true;
    }
  }

  checkStatus(currentStatus: string) {
    this.status.value =currentStatus;
    switch (currentStatus) {
      case AccountStatus.Active:
        this.status.text = 'Active';
        break;
      case AccountStatus.Inactive:
        this.status.text = 'Inactive';
        break;
    }
  }

  isEmpty(value: string) {
    switch (value) {
      case 'accountName':
        this.form.patchValue({
          accountName: ''
        });
        break;
      case 'remark':
        this.form.patchValue({
          remark: ''
        });
        break;
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  save() {
    this.submitted = true;
    if(this.status.value === '') {
      this.otherStatus = true;
    } else if(this.f.accountName.errors) {
      this.inputAccountName.nativeElement.focus();
    } else {
      const data = this.form.getRawValue();
      const dataInfo = {
        accountID: this.accountInfo.accountID,
        status: this.status.value,
        id: this.accountInfo.id,
        remark: data.remark
      };
      const api = this.baseUrl + '/api/account/v0/disable-account';
      this.hTTPService.Post(api,dataInfo).then((resposne)=> {
        if( resposne && resposne.result.responseCode !== '200') {
          this.translateErrorServer(resposne.result.responseMessage);
        }
       if(resposne.body != null && resposne.result.responseCode === '200' && resposne.body.responseCode === '200') {
        this.router.navigate(['/acc/my-account']);
       }

     });
    }
  }

  translateErrorServer(tran: string) {
    let message = '';

    switch(tran) {
      case 'Invalid_AccountID':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_AccountID');
        break;
      case 'Invalid_AccountStatus':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_AccountStatus');
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
