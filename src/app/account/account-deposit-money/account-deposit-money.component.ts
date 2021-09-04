import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { BTN_ROLES, LOCAL_STORAGE, TransactionType } from '../../shares/constants/common.const';
import { PipeUtils } from '../../shares/utils/pipe-utils';
import { TranslateService } from '@ngx-translate/core';
import { Account } from '../../shares/model/account';
import { Utils } from '../../shares/utils/utils.static';
import { environment } from 'src/environments/environment';
import { HTTPService } from '../../shares/services/http.service';
import { ModalService } from '../../shares/services/modal.service';
@Component({
  selector: 'app-account-deposit-money',
  templateUrl: './account-deposit-money.component.html',
  styleUrls: ['./account-deposit-money.component.css']
})
export class AccountDepositMoneyComponent implements OnInit {

  private baseUrl: string = '';

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
    private hTTPService: HTTPService,
    private modalService: ModalService,
  ) {
    this.baseUrl = environment.bizServer.server;
    this.form as FormGroup;

    this.form = this.formBuilder.group({
      yourAccount: [{value: '', disabled: true}, Validators.required],
      toAccount: [{value: '', disabled: true}, Validators.required],
      amount: ['', Validators.required],
      remark: [''],
      currency: [{value: 'KH', disabled: true}, Validators.required],
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
    this.modal.close( {close: BTN_ROLES.CLOSE, responseCode: '404'});
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
      } else if ( data.amount > this.userAccount.accountBalance) {
        this.translateErrorServer('AccountBalanceNotEnough');
      } else {
        const dataInfo = {
          fromAccountID: this.userAccount.accountID,
          fromAccountId: this.userAccount.id,

          toAccountID: this.subAccount.accountID,
          toAccountId: this.subAccount.id,

          transactionType: TransactionType.DepositMoney,
          transactionAmount: data.amount,

          remark: data.remark,
          currency: 'KH'
        };

        const api = this.baseUrl + '/api/transactionInfo/v0/doTransaction';
        this.hTTPService.Post(api,dataInfo).then(resposne=> {
          console.log('resposne',resposne);

          if( resposne && resposne.result.responseCode !== '200') {
            this.translateErrorServer(resposne.result.responseMessage);
          }
         if(resposne.body && resposne.body.responseCode === '200') {
          this.modal.close( {close: BTN_ROLES.SAVE, responseCode: resposne.body.responseCode});
         } else {
          this.modal.close( {close: '500', responseCode: '500'});
         }
       });
      }
    }
  }


  translateErrorServer(tran: string) {
    let message = '';

    switch(tran) {
      case 'Require_AccountID':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_AccountID');
        break;
      case 'Require_ToAccountID':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_ToAccountID');
        break;
      case 'Require_Amount':
        message = this.translateService.instant('ServerResponseCode.Label.Require_Amount');
        break;
      case 'Require_Currency':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_Currency');
        break;
      case 'AccountBalanceNotEnough':
        message = this.translateService.instant('Account.Message.AccountBalanceNotEnough');
        break;
      case 'Account_Balance_Not_Enough':
        message = this.translateService.instant('Account.Message.AccountBalanceNotEnough');
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
