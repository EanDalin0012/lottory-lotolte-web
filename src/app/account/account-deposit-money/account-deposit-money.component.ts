import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { BTN_ROLES, LOCAL_STORAGE } from '../../shares/constants/common.const';
import { PipeUtils } from '../../shares/utils/pipe-utils';
import { TranslateService } from '@ngx-translate/core';
import { Account } from '../../shares/model/account';
import { Utils } from '../../shares/utils/utils.static';

@Component({
  selector: 'app-account-deposit-money',
  templateUrl: './account-deposit-money.component.html',
  styleUrls: ['./account-deposit-money.component.css']
})
export class AccountDepositMoneyComponent implements OnInit {

  @ViewChild("amount") inputAmount: any;

  modal:any;
  form: any;
  submitted = false;
  thanZero = false;

  userAccount:Account = { id: 0, accountID: '', accountName: '', currency: '', accountType: '', status: '', accountBalance: 0};
  subAccount: Account = { id: 0, accountID: '', accountName: '', currency: '', accountType: '', status: '', accountBalance: 0};

  constructor(
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
  ) {
    this.form as FormGroup;

    this.form = this.formBuilder.group({
      yourAccount: [{value: '', disabled: true}, Validators.required],
      toAccount: [{value: '', disabled: true}, Validators.required],
      amount: ['', Validators.required],
      remark: ['']
    });

  }

  ngOnInit(): void {
    this.userAccount = Utils.getSecureStorage(LOCAL_STORAGE.Account_Info);
    if(this.modal.message) {
      this.subAccount = this.modal.message;
    }

    this.form.patchValue({
      yourAccount: PipeUtils.account(this.userAccount.accountID) + ' '+ this.userAccount.accountName,
      toAccount: PipeUtils.account(this.subAccount.accountID) + ' '+ this.subAccount.accountName
    });

  }


  isEmpty(value: string) {
    switch (value) {
      case 'amount':
        this.form.patchValue({
          amount: ''
        });
        break;
      case 'remark':
        this.form.patchValue({
          remark: ''
        });
        break;
    }
  }

  close() {
    this.modal.close( {close: BTN_ROLES.CLOSE});
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  save() {
    this.submitted = true;
    if(this.f.amount.errors) {
      this.inputAmount.nativeElement.focus();
    } else {
      const data = this.form.getRawValue();
      if(data.amount <= 0 ) {
        this.thanZero = true;
      } else {

      }
      console.log(data);
    }
  }

}
