import { Component, OnInit, ViewChild } from '@angular/core';
import { Account } from '../../shares/model/account';
import { TranslateService } from '@ngx-translate/core';
import { BTN_ROLES, LOCAL_STORAGE } from '../../shares/constants/common.const';
import { Utils } from '../../shares/utils/utils.static';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { PipeUtils } from '../../shares/utils/pipe-utils';

@Component({
  selector: 'app-account-withdrawal-cash-out',
  templateUrl: './account-withdrawal-cash-out.component.html',
  styleUrls: ['./account-withdrawal-cash-out.component.css']
})
export class AccountWithdrawalCashOutComponent implements OnInit {

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
      cashOutFromAccount: [{value: '', disabled: true}, Validators.required],
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
      cashOutFromAccount: PipeUtils.account(this.subAccount.accountID) + ' '+ this.subAccount.accountName
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
