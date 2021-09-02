import { Component, OnInit, ViewChild } from '@angular/core';
import { Account } from '../../shares/model/account';
import { DataTableDirective } from 'angular-datatables';
import { ModalService } from '../../shares/services/modal.service';
import { DataService } from '../../shares/services/data.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Utils } from '../../shares/utils/utils.static';
import { LOCAL_STORAGE, AccountTypeCode } from '../../shares/constants/common.const';
import { Subject } from 'rxjs';
import { HTTPService } from '../../shares/services/http.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { SubAccountRoutorUtil } from '../../shares/utils/sub-accunt-routor';
import { AddAccountComponent } from '../add-account/add-account.component';
@Component({
  selector: 'app-sub-account',
  templateUrl: './sub-account.component.html',
  styleUrls: ['./sub-account.component.css']
})
export class SubAccountComponent implements OnInit {

  private baseUrl: string = '';
  subAccountRoutorUtil = new SubAccountRoutorUtil(this.router);
  accounts: Account[] = [];
  accountInfo: Account= {
    id: 0,
    accountID: '',
    accountName: '',
    accountBalance: 0,
    accountType: '',
    currency: '',
    status: ''
  };
  accountDisplays: Account[] = [];

  @ViewChild(DataTableDirective, { static: false })
  dtElement: any;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  public rows:any[] = [];
  public srch:any[] = [];
  public statusValue: any;


  activeTab = {
    index: 0,
    class: 'nav-link'
  }

  accountInfoMain: Account= {
    id: 0,
    accountID: '',
    accountName: '',
    accountBalance: 0,
    accountType: '',
    currency: '',
    status: ''
  };

  accountTypeCode = AccountTypeCode;
  constructor(
    private modalService: ModalService,
    private dataService: DataService,
    private titleService: Title,
    private router: Router,
    private translate: TranslateService,
    private hTTPService: HTTPService,
  ) {
    this.baseUrl = environment.bizServer.server;

    this.titleService.setTitle('Account-Admin');
    this.dtElement as DataTableDirective;
    this.dtOptions = {
      // ... skipped ...
      // pageLength: 10,
      dom: "lrtip",
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };

    this.dataService.viewNewAccountCloseData.subscribe(message => {
      if(message && message.close === 'Close_Add_Account' && message.createdAccountType === AccountTypeCode.Master || message != '' && message.close === 'Close_Add_Account' && message.createdAccountType === AccountTypeCode.Agent) {
        this.inquiry();
      }
    });
   }

  ngOnInit(): void {
    const url = (window.location.href).split('/');
    this.dataService.visitParamRouterChange(url[3]);
    this.accountInfo = Utils.getSecureStorage(LOCAL_STORAGE.SubAccountSenair);
    this.accountInfoMain = Utils.getSecureStorage(LOCAL_STORAGE.Account_Info);
    if(this.accountInfo) {
      this.inquiry();
    }

  }

  inquiry(){
    const api = this.baseUrl + '/api/sub/account/v0/inquiry';
    const requestData = {
      mainAccountID: this.accountInfo.id,
    };
    this.hTTPService.Post(api,requestData).then((resposne)=> {

       if( resposne && resposne.result.responseCode !== '200' && resposne.result.responseMessage === 'Invalid_MainAccountID') {
        this.modalService.alert(
          this.translate.instant('ServerResponseCode.Label.Invalid_MainAccountID'),
         {
         modalClass: 'open-alert',
         btnText: this.translate.instant('Common.Button.Confirme'),
         callback: res => {

         }
       });
      }
      if(resposne && resposne.result.responseCode === '200') {
        this.accounts = resposne.body;
        this.accountDisplays = [];
        if(this.activeTab.index == 0) {
          this.accounts.forEach(element => {
            if(AccountTypeCode.Master == element.accountType) {
              this.accountDisplays.push(element);
            }
          });
        } else if (this.activeTab.index == 1) {
          this.accounts.forEach(element => {
            if(AccountTypeCode.Agent == element.accountType) {
              this.accountDisplays.push(element);
            }
          });
        }

      }

    });

    this.dtTrigger.next();
    this.rows = this.accounts;
    this.srch = [...this.rows];
  }

  edit(item: any) {

  }

  deposit(item: any) {

  }

  withdrawal(item: any) {

  }

  details(item:any) {

  }

  setting(item: any) {

  }

  onTab(index: number) {
    this.activeTab.index = index;
    this.inquiry();
  }

  onSubAccountRouter(item: Account) {
    this.subAccountRoutorUtil.subAccountRouter(item);
  }

  newAccount(accoutTypeCode: string) {
    let typeCode = '';
    if(AccountTypeCode.Master === accoutTypeCode) {
      typeCode = AccountTypeCode.Master
    } else if (AccountTypeCode.Agent === accoutTypeCode) {
      typeCode = AccountTypeCode.Agent
    }
    this.modalService.open(
      AddAccountComponent,
      {
      message: {
        openAccount: typeCode,
        accountInfo: this.accountInfo,
      },
      callback: _response => {
        console.log('_response', _response);

      }
    });
  }

}
