import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../shares/services/data.service';
import { SubAccount } from '../../shares/model/sub-account';
import { AccountStatusPipe } from '../../shares/pipe/account-status.pipe';
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
import { LOCAL_STORAGE } from '../../shares/constants/common.const';
import { DeviceInfo } from '../../shares/model/device-detector';
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  private baseUrl: string = '';

  subAccounts: Account[] = [];
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

  constructor(
    private titleService: Title,
    private router: Router,
    private dataService: DataService,
    private hTTPService: HTTPService
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
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
  }

  ngOnInit(): void {
    this.inquiry();
  }

  inquiry(){
    this.subAccounts = subAccounts;
    this.dtTrigger.next();
    this.rows = this.subAccounts;
    this.srch = [...this.rows];
    const api = this.baseUrl + '/api/my/account/v0/inquiry';
    const userInfo =Utils.getSecureStorage(LOCAL_STORAGE.USER_INFO);
    const requestData = {
      userName: userInfo.userName
    };
    this.hTTPService.Post(api,requestData).then((resposne)=> {
      console.log('resposne', resposne);
      if(resposne) {
        this.deviceInfos = resposne.deviceInfos;
        console.log(this.deviceInfos);
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

}
