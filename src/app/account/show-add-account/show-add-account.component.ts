import { Component, OnDestroy, OnInit } from '@angular/core';
import { BTN_ROLES } from '../../shares/constants/common.const';
import { Router } from '@angular/router';
import { DataService } from '../../shares/services/data.service';

@Component({
  selector: 'app-show-add-account',
  templateUrl: './show-add-account.component.html',
  styleUrls: ['./show-add-account.component.css']
})
export class ShowAddAccountComponent implements OnInit, OnDestroy {

  modal:any;
  createAccountType: string = '';
  dataInfo = {
    status: '',
    accountName: '',
    accountID: '',
    userName: '',
    password: ''

  }

  constructor(
    private dataService: DataService,
    private router: Router) { }

  ngOnDestroy(): void {
    this.dataService.unsubscribeNewAccountClose();
  }

  ngOnInit(): void {

    if(this.modal) {
      this.dataInfo = this.modal.message.resposne;
      this.createAccountType = this.modal.message.createAccountType;
      console.log(this.modal.dataInfo, this.createAccountType);
    }

  }

  close() {
    // /acc/my-account
    this.dataService.viewNewAccountCloseMessage({close: 'Close_Add_Account', createdAccountType: this.createAccountType});
    this.modal.close( {close: {close: 'Close_Add_Account', createdAccountType: this.createAccountType}});
  }

}
