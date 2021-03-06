import { Component, OnInit, ViewChild } from '@angular/core';
import { Account } from '../../shares/model/account';
import { AccountTypeCode, LOCAL_STORAGE } from '../../shares/constants/common.const';
import { Utils } from '../../shares/utils/utils.static';
import { DataTableDirective } from 'angular-datatables';
import { HTTPService } from '../../shares/services/http.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DataService } from '../../shares/services/data.service';
import { ModalService } from '../../shares/services/modal.service';
import { Subject } from 'rxjs';
import { SubAccountRoutorUtil } from '../../shares/utils/sub-accunt-routor';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sub-account-agent',
  templateUrl: './sub-account-agent.component.html',
  styleUrls: ['./sub-account-agent.component.css']
})
export class SubAccountAgentComponent implements OnInit {

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

   }

  ngOnInit(): void {
    this.dtOptions = {
      dom: "lrtip",
      pageLength: 10,
      processing: true
    };
    const url = (window.location.href).split('/');
    this.dataService.visitParamRouterChange(url[3]);
    this.accountInfo = Utils.getSecureStorage(LOCAL_STORAGE.SubAccountAgent);
    this.inquiry();
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
    this.subAccountRoutorUtil.subAccountRouter(item);
  }
}
