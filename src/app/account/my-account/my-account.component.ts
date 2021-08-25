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
import { id } from '../../../assets/all-modules-data/id';
import { ModalService } from '../../shares/services/modal.service';
import { TranslateService } from '@ngx-translate/core';
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
  accountInfo: Account = {
    id: 0,
    accountId: '',
    accountName: '',
    accountBalance: 0,
    accountType: '',
    status:'',
    currency: ''
  };

  constructor(
    private titleService: Title,
    private router: Router,
    private dataService: DataService,
    private modalService: ModalService,
    private hTTPService: HTTPService,
    private translate: TranslateService
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
      userName: userInfo.userName,
      userID: userInfo.id,
    };
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
        this.deviceInfos = resposne.body.deviceInfos;
        this.accountInfo = resposne.body.accountInfo;
        this.subAccounts = resposne.body.subAccounts;
        console.log(this.deviceInfos);
        console.log(this.accountInfo);
        console.log(this.subAccounts);
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
