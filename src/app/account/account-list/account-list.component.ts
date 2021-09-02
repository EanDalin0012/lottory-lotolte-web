import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalService } from '../../shares/services/modal.service';
import { DataService } from '../../shares/services/data.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { accountDatas } from './account-data';
import { Account } from 'src/app/shares/model/account';
import { Utils } from '../../shares/utils/utils.static';
import { LOCAL_STORAGE } from '../../shares/constants/common.const';
import { AddAccountComponent } from '../add-account/add-account.component';
import { Router } from '@angular/router';
import { StoreUtil } from '../../shares/utils/store';
import { HTTPService } from '../../shares/services/http.service';
declare const $: any;
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {

  private baseUrl: string = '';
  storeUtil = new StoreUtil();
  accounts: Account[] = [];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any;
  public dtOptions: DataTables.Settings = {};

  public rows:any[] = [];
  public srch:any[] = [];
  public statusValue: any;
  public dtTrigger: Subject<any> = new Subject();

  public pipe = new DatePipe("en-US");
  url: any = "overtime";
  public tempId: any;
  public editId: any;
  accountType = '';

  accountDisplay: Account[] = [];

  i = 1;
  constructor(
    private modalService: ModalService,
    private dataService: DataService,
    private titleService: Title,
    private router: Router,
    private hTTPService: HTTPService,
    private translate: TranslateService,
  ) {
    this.baseUrl = environment.bizServer.server;
    this.titleService.setTitle('Account-Admin');
    this.dtElement as DataTableDirective;
    this.dtOptions = {
      // ... skipped ...
      // pageLength: 10,
      dom: "lrtip",
      // pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
  }

  ngOnInit(): void {
    const url = (window.location.href).split('/');
    this.dataService.visitParamRouterChange(url[3]);
    this.dataService.visitSourceParamRoutorChangeData.subscribe(message => {
      const account_type = Utils.getSecureStorage(LOCAL_STORAGE.AccountTypeCode);

      console.log('account_type',account_type);

      this.accountType = account_type;
      this.inquiry();
    });

    this.inquiry();
  }

  inquiry(){
      this.accounts = accountDatas;
      this.accountDisplay = [];
      this.accounts.forEach(element => {
        if(this.accountType == element.accountType) {
          this.accountDisplay.push(element);
        }
      });
    const userInfo =Utils.getSecureStorage(LOCAL_STORAGE.USER_INFO);
    const requestData = {
      userName: userInfo.userName,
      userID: userInfo.id,
    };
    const api = this.baseUrl + '/api/my/account/v0/inquiry';

    this.hTTPService.Post(api,requestData).then((resposne)=> {
      console.log('resposne', resposne);
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
        this.accountDisplay = resposne.body.subAccounts;
      }

    });

      this.dtTrigger.next();
      this.rows = this.accountDisplay
      this.srch = [...this.rows];
  }

  edit(value:any) {

  }

  deposit(value:any) {
    // this.modalService.open(
    //   AccountDepositComponent,
    //   {
    //     message: value,
    //     callback: _response => {

    //   }
    // });
  }

  withdrawal(value:any) {
    // this.modalService.open(
    //   AccountWithdrawalComponent,
    //   {
    //     message: value,
    //     callback: _response => {

    //   }
    // });
  }

  newAccount() {
    this.modalService.open(
      AddAccountComponent,
      {
      message: {
        accountID: '999999999',
        acountName: 'Compay Account'
      },
      callback: _response => {

      }
    });
  }

  details(item: any) {
    Utils.setSecureStorage('toDetailsAccountInfo', item);
    this.router.navigate(['/acc/details']);
  }

  setting(item: any) {
    Utils.setSecureStorage('account-setting', item);
    StoreUtil.set('account-setting', item);
    this.router.navigate(['/acc/account-setting']);
  }

  onSeniar(item: any) {
    Utils.setSecureStorage('sub-account', item);
    this.router.navigate(['/acc/sub-account']);
  }

}
