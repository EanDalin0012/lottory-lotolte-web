import { Component, OnInit, ViewChild } from '@angular/core';
import { Account } from '../../shares/model/account';
import { TranslateService } from '@ngx-translate/core';
import { BTN_ROLES, LOCAL_STORAGE, TransactionType, AccountCompany } from '../../shares/constants/common.const';
import { Utils } from '../../shares/utils/utils.static';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { PipeUtils } from '../../shares/utils/pipe-utils';
import { environment } from 'src/environments/environment';
import { HTTPService } from '../../shares/services/http.service';
import { ModalService } from '../../shares/services/modal.service';
@Component({
  selector: 'app-account-withdrawal-cash-out',
  templateUrl: './account-withdrawal-cash-out.component.html',
  styleUrls: ['./account-withdrawal-cash-out.component.css']
})
export class AccountWithdrawalCashOutComponent implements OnInit {

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
      } else if ( data.amount > this.subAccount.accountBalance) {
        this.translateErrorServer('AccountNotEnoughBalance');
      } else {
        const dataInfo = {
          fromAccountID: this.subAccount.accountID,
          fromAccountId: this.subAccount.id,

          toAccountID: AccountCompany[0].accountID,
          toAccountId: AccountCompany[0].id,

          transactionType: TransactionType.WithdrawalCashOut,
          transactionAmount: data.amount,

          remark: data.remark,
          currency: 'KH'
        };
        console.log(dataInfo);

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
      console.log(data);
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
      case 'AccountNotEnoughBalance':
        message = this.translateService.instant('Account.Message.AccountNotEnoughBalance', {account: PipeUtils.account(this.subAccount.accountID) + ' - '+ this.subAccount.accountName});
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
