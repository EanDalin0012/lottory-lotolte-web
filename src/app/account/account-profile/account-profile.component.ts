import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shares/services/data.service';
import { Utils } from '../../shares/utils/utils.static';
import { LOCAL_STORAGE } from '../../shares/constants/common.const';
import { environment } from 'src/environments/environment';
import { Account } from '../../shares/model/account';
import { UserInfomation } from '../../shares/model/user';
@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.component.html',
  styleUrls: ['./account-profile.component.css']
})
export class AccountProfileComponent implements OnInit {

  private baseUrl: string = '';
  src = '';
  imageName = '';

  userInfo: UserInfomation = {
    id: 0,
  firstName: '',
  lastName:'',
  userName: '',
  dateBirth: '',
  gender:'',
  resourceID: 0,
  phoneNumber: '',
  otherPhoneNumber: '',
  createDate: '',
  address: ''
  };
  account:Account = {
    id: 0,
    accountId: '',
    accountName:'',
    accountBalance: 0,
    currency: '',
    accountType: '',
    status: ''
  };
  constructor(private dataService: DataService) {
    this.baseUrl = environment.bizServer.server;
   }

  ngOnInit(): void {
    const url = (window.location.href).split('/');
    this.dataService.visitParamRouterChange(url[4]);
    this.userInfo = Utils.getSecureStorage(LOCAL_STORAGE.USER_INFO);
    this.account = Utils.getSecureStorage(LOCAL_STORAGE.Account_Info);
    console.log(this.account);

    this.src = this.baseUrl + '/api/image/reader/v0/read/'+this.userInfo.resourceID;

    this.imageName = this.userInfo.firstName + ' ' + this.userInfo.lastName;
  }

}
