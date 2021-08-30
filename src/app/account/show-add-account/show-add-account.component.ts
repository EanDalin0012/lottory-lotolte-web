import { Component, OnInit } from '@angular/core';
import { BTN_ROLES } from '../../shares/constants/common.const';
import { Router } from '@angular/router';
import { DataService } from '../../shares/services/data.service';

@Component({
  selector: 'app-show-add-account',
  templateUrl: './show-add-account.component.html',
  styleUrls: ['./show-add-account.component.css']
})
export class ShowAddAccountComponent implements OnInit {

  modal:any;
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

  ngOnInit(): void {
    console.log(this.modal.message);
    if(this.modal) {
      this.dataInfo = this.modal.message;
      console.log(this.dataInfo);

    }

  }

  close() {
    // /acc/my-account
    this.dataService.viewNewAccountCloseMessage('Close_New_Account');
    this.modal.close( {close: 'Close_Add_Account'});
  }

}
