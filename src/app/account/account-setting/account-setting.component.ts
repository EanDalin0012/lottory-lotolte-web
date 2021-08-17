import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { AccountStatus } from 'src/app/shares/constants/common.const';
import { StatusAccount } from '../../shares/model/account-status';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { Utils } from '../../shares/utils/utils.static';
import { Account } from 'src/app/shares/model/account';
import { PipeUtils } from '../../shares/utils/pipe-utils';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit {

  id: number = 0;
  accountId: string = '';
  accountName: string = '';
  accountBalace: number = 0;
  accountBalaceDisplay = '';
  currency: string = '';
  accountType: string = '';
  _status: string = '';
  remark: string = '';
  accountStatus: StatusAccount[] = [];
  otherStatus = false;
  status: StatusAccount = {
    text: '',
    value: ''
  };
  defaultAccountStatus:StatusAccount = {
    text: this.translateService.instant('Account.Label.selectAccountStatus'),
    value: ''
  };
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };


  constructor(
    private translateService: TranslateService
  ) {
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
   }

  ngOnInit(): void {
    console.log('StoreUtil', Utils.getSecureStorage('account-setting'));
    const accountInfo = Utils.getSecureStorage('account-setting') as Account;
    this.accountId = PipeUtils.account(accountInfo.accountId); ;
    this.accountName = accountInfo.accountName;
    this._status = accountInfo.status;
    this.id = accountInfo.id;
    this.accountBalace = accountInfo.accountBalace ;
    this.accountBalaceDisplay = accountInfo.accountBalace + ' '+accountInfo.currency;
    this.checkStatus(accountInfo.status);
  }

  submitCompany() {

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
      case 'n':
        this.accountName = '';
        break;
      case 'r':
        this.remark = '';
        break;
    }
  }
}
