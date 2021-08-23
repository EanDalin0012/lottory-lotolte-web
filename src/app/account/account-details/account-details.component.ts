import { Component, OnInit, ViewChild } from '@angular/core';
import { StoreUtil } from '../../shares/utils/store';
import { Account } from 'src/app/shares/model/account';
import { Utils } from '../../shares/utils/utils.static';
import { DeviceInfo } from '../../shares/model/device-detector';
import { deviceInfos } from 'src/assets/all-modules-data/all-modules-data';
import { DataTableDirective } from 'angular-datatables';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {

  account: Account = {
    id: 0,
    accountId: '',
    accountName: '',
    accountType: '',
    accountBalace: 0,
    currency: '',
    status: ''
  };

  activeTab = {
    index: 0,
    class: 'nav-link'
  }

  @ViewChild(DataTableDirective, { static: false })
  dtElement: any;
  public dtOptions: DataTables.Settings = {};
  deviceLoginInfos: DeviceInfo[] = [];
  public rows:any[] = [];
  public srch:any[] = [];
  public statusValue: any;
  public dtTrigger: Subject<any> = new Subject();

  storeUtil = new StoreUtil();
  constructor(
    private titleService: Title
  ) {
    this.titleService.setTitle('Account-Details');
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
    this.account = Utils.getSecureStorage('toDetailsAccountInfo');
    this.inquiryDeviceInfo();
  }

  onTab(index: number) {
    this.activeTab.index = index;
  }

  inquiryDeviceInfo(){
    this.deviceLoginInfos = deviceInfos;
    this.dtTrigger.next();
    this.rows = this.deviceLoginInfos
    this.srch = [...this.rows];
  }
}
