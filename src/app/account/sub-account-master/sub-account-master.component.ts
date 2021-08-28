import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountTypeCode, LOCAL_STORAGE } from '../../shares/constants/common.const';
import { Account } from '../../shares/model/account';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ModalService } from '../../shares/services/modal.service';
import { DataService } from '../../shares/services/data.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HTTPService } from '../../shares/services/http.service';
import { environment } from 'src/environments/environment';
import { Utils } from '../../shares/utils/utils.static';
import { SubAccountRoutorUtil } from '../../shares/utils/sub-accunt-routor';
@Component({
  selector: 'app-sub-account-master',
  templateUrl: './sub-account-master.component.html',
  styleUrls: ['./sub-account-master.component.css']
})
export class SubAccountMasterComponent implements OnInit {

  private baseUrl: string = '';
  subAccountRoutorUtil = new SubAccountRoutorUtil(this.router);
  accounts: Account[] = [];
  accountInfo: Account= {
    id: 0,
    accountId: '',
    accountName: '',
    accountBalance: 0,
    accountType: '',
    currency: '',
    status: ''
  };

  accountInfoMain: Account= {
    id: 0,
    accountId: '',
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
      pageLength: 10,
      processing: true
    };
   }

  ngOnInit(): void {
    const url = (window.location.href).split('/');
    this.dataService.visitParamRouterChange(url[3]);
    this.accountInfo = Utils.getSecureStorage(LOCAL_STORAGE.SubAccountMaster);
    this.accountInfoMain = Utils.getSecureStorage(LOCAL_STORAGE.Account_Info);
    console.log('accountInfoMain', this.accountInfoMain);

    // this.dataService.visitSourceParamRoutorChangeData.subscribe(message => {
    //   const account_type = Utils.getSecureStorage(LOCAL_STORAGE.AccountTypeCode);
    //   //this.accountType = account_type;
    //   // this.inquiry();
    // });

    this.inquiry();

  }

  inquiry(){
    // this.accounts = accountMasterAndAgent;
    // this.accountDisplays = [];
    // if(this.activeTab.index == 0) {
    //   this.accounts.forEach(element => {
    //     if(AccountTypeCode.Master == element.accountType) {
    //       this.accountDisplays.push(element);
    //     }
    //   });
    // } else if (this.activeTab.index == 1) {
    //   this.accounts.forEach(element => {
    //     if(AccountTypeCode.Agent == element.accountType) {
    //       this.accountDisplays.push(element);
    //     }
    //   });
    // }


    const api = this.baseUrl + '/api/sub/account/v0/inquiry';
    // const accountInfo = Utils.getSecureStorage(LOCAL_STORAGE.SubAccount_Info);
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
        console.log(resposne);
        this.accounts = resposne.body;
        this.accountDisplays = [];
        if(this.activeTab.index == 0) {
          this.accounts.forEach(element => {
            if(AccountTypeCode.Agent == element.accountType) {
              this.accountDisplays.push(element);
            }
          });
        } else if (this.activeTab.index == 1) {
          this.accounts.forEach(element => {
            if(AccountTypeCode.Member == element.accountType) {
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

  newAccount() {
    // this.modalService.open(
    //   AddAccountComponent,
    //   {
    //   callback: _response => {

    //   }
    // });
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
    console.log(item);
    this.subAccountRoutorUtil.subAccountRouter(item);
  }

}
