import { Component, OnInit } from '@angular/core';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { Account } from 'src/app/shares/model/account';
import { BTN_ROLES, LOCAL_STORAGE } from '../../shares/constants/common.const';
import { accountDatas } from '../account-list/account-data';
import { Utils } from '../../shares/utils/utils.static';
import { TranslateService } from '@ngx-translate/core';
import { PipeUtils } from '../../shares/utils/pipe-utils';
import { ModalService } from '../../shares/services/modal.service';

@Component({
  selector: 'app-account-deposit',
  templateUrl: './account-deposit.component.html',
  styleUrls: ['./account-deposit.component.css']
})
export class AccountDepositComponent implements OnInit {

  modal:any;
  typeList: any[] = [];
  categoryName = '';
  description = '';
  currenctAccount: string = '000-000-001';
  currenctAccountName: string = 'Ean Dalin';
  amount: number = 0.00;
  toAccountId: string = '';
  toAccountName: string = '';

  displayToAccount: string = '';

  defaultAccount = {
    id: 0, accountId: '', accountName: 'Select Account', currency: '', accountType: '', status: '', accountBalace: 0
  };
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };
  accounts:Account[] = [];
  account:Account = { id: 0, accountID: '', accountName: '', currency: '', accountType: '', status: '', accountBalance: 0};
  accountDisplay:Account[] = [];

  constructor(
    private translateService: TranslateService,
    private modalService: ModalService,
  ) { }

  ngOnInit(): void {
    if(this.modal.message) {
      this.toAccountId = this.modal.message.accountId;
      this.toAccountName = this.modal.message.accountName;
      this.displayToAccount = this.translateService.instant('Deposit.Label.DisplayToAccount', {accountID: PipeUtils.account(this.toAccountId), accountName: this.toAccountName});

    }
    const account_type = Utils.getSecureStorage(LOCAL_STORAGE.AccountTypeCode);
    const accountType = account_type;

    this.accounts = accountDatas;
      this.accountDisplay = [];
      this.accounts.forEach(element => {
        if(accountType == element.accountType) {
          this.accountDisplay.push(element);
        }
    });

    console.log(this.accountDisplay);

  }


  private isValid() {
    // if (!this.category_name || this.category_name && this.category_name.trim() === ''
    //     || this.category_name && this.category_name === null) {
    //       const bool = this.modalService.messageAlert(this.translateTxt.MESSAGE_ERROR.MAIN_CATEGORY_REQUEIRED);
    //       return bool;
    // } else {
    //   return true;
    // }
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

  alertMessage() {
    const closeText = this.translateService.instant('Common.Button.Close');
    const confirmText = this.translateService.instant('Common.Button.Confirme');
    this.modalService.confirm(
      this.translateService.instant(
        'Account.Message.DoYouWantDepositMoney',
        {
          fromAccountID: this.currenctAccount + '-' + this.currenctAccountName,
          toAccountId: this.toAccountId + '-' + this.toAccountName,
          amount: this.amount
        }
      ),
      {
        title: this.translateService.instant('Common.Label.depositMoney'),
        lBtn: {btnText: closeText},
        rBtn: {btnText: confirmText},
        modalClass: 'pop-confirm-btn dialog-confirm popup',
        callback: response => {
          console.log(response);
        }
      }
    );
  }
  isEmpty(code: string) {
    switch (code) {
      case 'amount':
        this.amount = 0;
        break;
      case 'r':
        this.description ='';
        break;
    }
  }
}
