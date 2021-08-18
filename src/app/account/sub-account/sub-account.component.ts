import { Component, OnInit, ViewChild } from '@angular/core';
import { Account } from '../../shares/model/account';
import { DataTableDirective } from 'angular-datatables';
import { ModalService } from '../../shares/services/modal.service';
import { DataService } from '../../shares/services/data.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Utils } from '../../shares/utils/utils.static';
import { LOCAL_STORAGE, AccountTypeCode } from '../../shares/constants/common.const';
import { accountDatas } from '../account-list/account-data';
import { Subject } from 'rxjs';
import { accountMasterAndAgent } from '../../../assets/all-modules-data/all-modules-data';

@Component({
  selector: 'app-sub-account',
  templateUrl: './sub-account.component.html',
  styleUrls: ['./sub-account.component.css']
})
export class SubAccountComponent implements OnInit {

  accounts: Account[] = [];
  accountInfo: Account= {
    id: 0,
    accountId: '',
    accountName: '',
    accountBalace: 0,
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
    private router: Router
  ) {
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
   }

  ngOnInit(): void {
    const url = (window.location.href).split('/');
    this.dataService.visitParamRouterChange(url[3]);
    this.accountInfo = Utils.getSecureStorage('sub-account');
    this.dataService.visitSourceParamRoutorChangeData.subscribe(message => {
      const account_type = Utils.getSecureStorage(LOCAL_STORAGE.AccountTypeCode);
      //this.accountType = account_type;
      this.inquiry();
    });

    this.inquiry();

  }

  inquiry(){
    this.accounts = accountMasterAndAgent;
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

}
