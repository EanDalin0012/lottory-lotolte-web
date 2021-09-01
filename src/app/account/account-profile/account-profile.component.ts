import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shares/services/data.service';
import { Utils } from '../../shares/utils/utils.static';
import { LOCAL_STORAGE } from '../../shares/constants/common.const';
import { environment } from 'src/environments/environment';
import { Account } from '../../shares/model/account';
import { UserInfomation } from '../../shares/model/user';
import { ModalService } from '../../shares/services/modal.service';
import { EditAccountInfoComponent } from '../edit-account-info/edit-account-info.component';
import { EditPersonalInfoComponent } from '../edit-personal-info/edit-personal-info.component';
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
    accountID: '',
    accountName:'',
    accountBalance: 0,
    currency: '',
    accountType: '',
    status: ''
  };
  constructor(
    private modalService: ModalService,
    private dataService: DataService
    ) {
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

  profileEdit() {
    this.modalService.open(
      EditPersonalInfoComponent,
      {
        message: this.userInfo,
        callback: _response => {
          console.log('_response', _response);
          if(_response && _response.responseCode === '200') {
            this.userInfo.firstName = _response.personalInfo.firstName;
            this.userInfo.lastName = _response.personalInfo.lastName;
            this.userInfo.address = _response.personalInfo.address;
            this.userInfo.gender  = _response.personalInfo.gender;
            this.userInfo.resourceID = _response.personalInfo.resourceID;
            this.userInfo.phoneNumber = _response.personalInfo.phoneNumber;
            this.userInfo.otherPhoneNumber = _response.personalInfo.otherPhoneNumber;
            this.userInfo.dateBirth        = _response.personalInfo.dateBirth;
            Utils.setSecureStorage(LOCAL_STORAGE.USER_INFO, this.userInfo);
            this.src = this.baseUrl + '/api/image/reader/v0/read/'+this.userInfo.resourceID;
            this.dataService.chageProfileDataMessage(this.userInfo.resourceID);

          }

        }
    });
  }

  AccountInfoEdit() {
    this.modalService.open(
      EditAccountInfoComponent,
      {
        message: this.account,
        callback: _response => {

      }
    });
  }

}
