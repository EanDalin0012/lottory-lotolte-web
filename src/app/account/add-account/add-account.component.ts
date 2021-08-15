import { Component, OnInit } from '@angular/core';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { Account } from '../../shares/model/account';
import { Utils } from '../../shares/utils/utils.static';
import { LOCAL_STORAGE, BTN_ROLES } from '../../shares/constants/common.const';
import { accountDatas } from '../account-list/account-data';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {

  modal:any;
  typeList: any[] = [];
  categoryName = '';
  description = '';
  currenctAccount: string = '000-000-001';
  currenctAccountName: string = 'Ean Dalin';
  amount: number = 0.00;

  defaultAccount = {
    id: 0, accountId: '', accountName: 'Select Account', currency: '', accountType: '', status: '', accountBalace: 0
  };
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };
  accounts:Account[] = [];
  account:Account = { id: 0, accountId: '', accountName: '', currency: '', accountType: '', status: '', accountBalace: 0};
  accountDisplay:Account[] = [];
  constructor() { }

  ngOnInit(): void {
    console.log();
    const account_type = Utils.getSecureStorage(LOCAL_STORAGE.AccountTypeCode);
    console.log('account_type', account_type);
    const accountType = account_type;

    this.accounts = accountDatas;
      this.accountDisplay = [];
      this.accounts.forEach(element => {
        if(accountType == element.accountType) {
          this.accountDisplay.push(element);
        }
    });
  }

  close() {
    this.modal.close( {close: BTN_ROLES.CLOSE});
  }

  onClickBtnMainCategoryName() {
      this.categoryName = '';
  }

  onClickBtndescription() {
    this.description = '';
  }
}
