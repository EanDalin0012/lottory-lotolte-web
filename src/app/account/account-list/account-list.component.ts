import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalService } from '../../shares/services/modal.service';
import { DataService } from '../../shares/services/data.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { accountDatas } from './account-data';
import { Account } from 'src/app/shares/model/account';
import { Utils } from '../../shares/utils/utils.static';
import { LOCAL_STORAGE } from '../../shares/constants/common.const';
import { AccountDepositComponent } from '../account-deposit/account-deposit.component';
import { AddAccountComponent } from '../add-account/add-account.component';
import { AccountPipe } from '../../shares/pipe/account.pipe';
import { AccountWithdrawalComponent } from '../account-withdrawal/account-withdrawal.component';
declare const $: any;
@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
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
  ) {

    this.titleService.setTitle('Account-Admin');
    this.dtElement as DataTableDirective;
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: "lrtip",
    };
  }

  ngOnInit(): void {
    const url = (window.location.href).split('/');
    this.dataService.visitMessage(url[5]);
    this.dataService.visitSourceParamRoutorChangeData.subscribe(message => {
      if (message !== '') {
        this.accountType = message;
        this.inquiry('ngOnInit');
      } else {

        const account_type = Utils.getSecureStorage(LOCAL_STORAGE.AccountTypeCode);
        console.log('account_type', account_type);
        this.accountType = account_type;
      }
    });

    this.inquiry('ngOnInit');
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: "lrtip",
    };


  }

  inquiry(note: string){
    console.log(note);

      this.accounts = accountDatas;
      this.accountDisplay = [];
      this.accounts.forEach(element => {
        if(this.accountType == element.accountType) {
          this.accountDisplay.push(element);
        }
      });
      console.log(this.accountDisplay, this.accountDisplay.length);

      this.dtTrigger.next();
      this.rows = this.accountDisplay
      this.srch = [...this.rows];
  }

  edit(value:any) {

  }

  deposit(value:any) {
    this.modalService.open(
      AccountDepositComponent,
      {
        message: value,
        callback: _response => {

      }
    });
  }

  withdrawal(value:any) {
    this.modalService.open(
      AccountWithdrawalComponent,
      {
        message: value,
        callback: _response => {

      }
    });
  }

  newAccount() {
    this.modalService.open(
      AddAccountComponent,
      {
      callback: _response => {

      }
    });
  }

}
