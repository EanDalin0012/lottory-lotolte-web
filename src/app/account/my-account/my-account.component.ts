import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../shares/services/data.service';
import { Account } from 'src/app/shares/model/account';
import { subAccounts } from 'src/assets/all-modules-data/all-modules-data';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Utils } from '../../shares/utils/utils.static';
import { StoreUtil } from '../../shares/utils/store';
import { HTTPService } from '../../shares/services/http.service';
import { environment } from 'src/environments/environment';
import { LOCAL_STORAGE, AccountTypeCode } from '../../shares/constants/common.const';
import { DeviceInfo } from '../../shares/model/device-detector';
import { ModalService } from '../../shares/services/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { AddAccountComponent } from '../add-account/add-account.component';
import { SubAccountRoutorUtil } from '../../shares/utils/sub-accunt-routor';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { AccountDepositMoneyComponent } from '../account-deposit-money/account-deposit-money.component';
import { AccountWithdrawalCashOutComponent } from '../account-withdrawal-cash-out/account-withdrawal-cash-out.component';
import { NotificService } from '../../shares/services/notific.service';
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  private baseUrl: string = '';
  subAccountRoutorUtil = new SubAccountRoutorUtil(this.router);
  subAccounts: Account[] = [];
  acountTypeCode = AccountTypeCode;
  activeTab = {
    index: 0,
    class: 'nav-link'
  }

  @ViewChild(DataTableDirective, { static: false })
  dtElement: any;
  public dtOptions: DataTables.Settings = {};
  public rows:any[] = [];
  public srch:any[] = [];
  public statusValue: any;
  public dtTrigger: Subject<any> = new Subject();

  deviceInfos: DeviceInfo[] = [];
  accountInfo: Account = {
    id: 0,
    accountID: '',
    accountName: '',
    accountBalance: 0,
    accountType: '',
    status:'',
    currency: ''
  };

  depositTransactionHistorys = [
    {
      id: 0,
      accountID: '',
      accountId: 0,
      accountName: '',
      amount: 0,
      currency: '',
      createBy: 0,
      date: ''
    }
  ];

  withdrawalCashOutTransactionHistorys = [
    {
      id: 0,
      accountID: '',
      accountId: 0,
      accountName: '',
      amount: 0,
      currency: '',
      createBy: 0,
      date: ''
    }
  ];


  constructor(
    private titleService: Title,
    private router: Router,
    private dataService: DataService,
    private modalService: ModalService,
    private hTTPService: HTTPService,
    private translate: TranslateService,
    private notificService: NotificService
  ) {
    this.baseUrl = environment.bizServer.server;
    const url = (window.location.href).split('/');
    this.dataService.visitParamRouterChange(url[4]);
    this.titleService.setTitle('My-Account');
    this.dtElement as DataTableDirective;
    this.dtOptions = {
      // ... skipped ...
      // pageLength: 10,
      dom: "lrtip",
      pageLength: 10,
      processing: true
    };
    this.dataService.viewNewAccountCloseData.subscribe(message => {
      if(message && message.close === 'Close_Add_Account' && message.createdAccountType === AccountTypeCode.Seniar) {
        this.inquiry();
      }
    });


  }

  ngOnInit(): void {
    this.inquiry();
  }

  inquiry(){

    const api = this.baseUrl + '/api/my/account/v0/inquiry';
    const userInfo =Utils.getSecureStorage(LOCAL_STORAGE.USER_INFO);
    const requestData = {
      userName: userInfo.userName,
      userID: userInfo.id,
    };
    this.hTTPService.Post(api,requestData).then((resposne)=> {
       if( resposne && resposne.result.responseCode !== '200' && resposne.result.responseMessage === 'Invalid_UserID') {
        this.modalService.alert(
          this.translate.instant('ServerResponseCode.Label.Invalid_UserID'),
         {
         modalClass: 'open-alert',
         btnText: this.translate.instant('Common.Button.Confirme'),
         callback: res => {

         }
       });
      }
      if(resposne && resposne.result.responseCode === '200') {
        this.deviceInfos = resposne.body.deviceInfos;
        this.accountInfo = resposne.body.accountInfo;
        console.log(this.accountInfo);
        this.transactionHistory();
        this.checkActiveIndexTabeByAccountType(this.accountInfo.accountType);
        this.subAccounts = resposne.body.subAccounts;
        this.dtTrigger.next();
        this.rows = this.subAccounts;
        this.srch = [...this.rows];
      }

    });
  }

  transactionHistory() {
    const api = this.baseUrl + '/api/transactionInfo/v0/inquiry-transaction-history';
    const dataInfo = {
        id: this.accountInfo.id,
        accountID: this.accountInfo.accountID
    };

    this.hTTPService.Post(api,dataInfo).then((resposne)=> {
      console.log(resposne);

      if( resposne && resposne.result.responseCode !== '200') {
        this.message(resposne.result.responseMessage);
     }
     if(resposne && resposne.result.responseCode === '200') {
       this.depositTransactionHistorys = resposne.body.depositMoneys;
       this.withdrawalCashOutTransactionHistorys = resposne.body.withdrawalCashOuts;
      console.log('depositTransactionHistorys', this.depositTransactionHistorys);
      console.log('withdrawalCashOutTransactionHistorys', this.withdrawalCashOutTransactionHistorys);

     }

   });
  }

  onTab(index: number) {
    this.activeTab.index = index;
  }

  setting(item: any) {
    Utils.setSecureStorage('account-setting', item);
    StoreUtil.set('account-setting', item);
    this.router.navigate(['/acc/account-setting']);
  }

  withdrawalCashOut(value:any) {
    this.modalService.open(
      AccountWithdrawalCashOutComponent,
      {
        message: value,
        callback: _response => {
          console.log('_response', _response);

          if(_response != null && _response.responseCode != null &&_response.responseCode === '200') {
            this.inquiry();
            this.notificService.showTopRight('Withdrawal Cash Out Success', 'success');
          } else if (_response && _response != null &&_response.close != null &&_response.close === '500' && _response.responseCode != null && _response.responseCode === '500') {
            this.notificService.showTopRight('Deposit Money Error', 'error');
          }
      }
    });
  }

  depositMoney(value:Account) {
    console.log(value);
    if(this.accountInfo.accountBalance <= 0 ) {
        this.message('Invalid_Balance');
    } else {
      this.modalService.open(
        AccountDepositMoneyComponent,
        {
          message: value,
          callback: _response => {
            console.log('_response', _response);

            if(_response != null && _response.responseCode != null &&_response.responseCode === '200') {
              this.inquiry();
              this.notificService.showTopRight('Deposit Money Success', 'success');
            } else if (_response && _response != null &&_response.close != null &&_response.close === '500' && _response.responseCode != null && _response.responseCode === '500') {
              this.notificService.showTopRight('Deposit Money Error', 'error');
            }

        }
      });
    }

  }

  newAccount() {
    this.modalService.open(
      AddAccountComponent,
      {
      message: {
        openAccount: AccountTypeCode.Seniar,
        accountInfo: this.accountInfo,
      },
      callback: _response => {
        console.log('_response', _response);
      }
    });
  }

  resetPassword(item: Account) {
    this.modalService.open(
      ResetPasswordComponent,
      {
      message: {
        accountInfo: item,
      },
      callback: _response => {
        console.log('_response', _response);

      }
    });
  }

  details(item: any) {
    Utils.setSecureStorage('toDetailsAccountInfo', item);
    this.router.navigate(['/acc/details']);
  }

  onSubAccountRouter(item: Account) {
    this.subAccountRoutorUtil.subAccountRouter(item);
  }

  checkActiveIndexTabeByAccountType(accountType: string) {
      switch (accountType) {
        case AccountTypeCode.Admin:
          this.activeTab.index = 0;
          break;
        case AccountTypeCode.Seniar:
          this.activeTab.index = 1;
          break;
        case AccountTypeCode.Master:
          this.activeTab.index = 3;
          break;
        case AccountTypeCode.Agent:
          this.activeTab.index = 5;
          break;
      }
  }

  message(value: string) {
    let message = '';

    switch(value) {
      case 'Invalid_Balance':
        message = this.translate.instant('Account.Message.AcountBalance0');
        break;
      case 'Invalid_LastName':
        message = this.translate.instant('ServerResponseCode.Label.Invalid_LastName');
        break;
      case 'Require_AccountID':
        message = this.translate.instant('ServerResponseCode.Label.Invalid_AccountID');
        break;
      case '500':
        message = this.translate.instant('ServerResponseCode.Label.Server_Error');
        break;
    }
    this.modalService.alert(
      message,
     {
     modalClass: 'open-alert',
     btnText: this.translate.instant('Common.Button.Confirme'),
     callback: res => {

     }
   });
  }
}
