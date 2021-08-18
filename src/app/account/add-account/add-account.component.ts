import { Component, OnInit } from '@angular/core';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { Account } from '../../shares/model/account';
import { Utils } from '../../shares/utils/utils.static';
import { LOCAL_STORAGE, BTN_ROLES } from '../../shares/constants/common.const';
import { accountDatas } from '../account-list/account-data';
import { TranslateService } from '@ngx-translate/core';
import { StepperActivateEvent } from '@progress/kendo-angular-layout';

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

  public stepsIcons = [
    {
      label: '',
      isValid: false
    }
  ];
  public currentStep = 0;
  firstName:string = '';
  lastName: string = '';
  gender:string = '';
  dateBirth: Date = new Date();

  constructor(
    private translateService: TranslateService
  ) {
    this.stepsIcons = [
      { label: 'Info',  isValid: true },
      { label: 'Info2', isValid: true }
    ];
   }

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

  public onStepActivate(ev: StepperActivateEvent): void {
    if (ev.index === this.stepsIcons.length - 1) {
        ev.preventDefault();
        this.currentStep =  this.stepsIcons.length - 1;
        console.log('Please fill previous steps');
    }
    console.log(`Step ${ev.index} was activated`);
    console.log(ev);
  }

    // end file select function
  public prev(): void {
    this.currentStep -= 1;
  }

  public next(value: number): void {
    console.log(value);
    this.currentStep += 1;
    if(value === 0) {
      // if(this.checkUserInfo()) {
      //   this.stepsIcons[0].isValid =  true;
      //   this.stepsIcons[1].isValid =  true;
      //   this.currentStep += 1;
      // } else {
      //   this.stepsIcons[0].isValid =  false;
      // }
    } else if (value === 1) {
      this.currentStep += 1;
    }
  }
}
