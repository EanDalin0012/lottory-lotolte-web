import { Component, OnInit } from '@angular/core';
import { BTN_ROLES } from '../../shares/constants/common.const';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log(this.modal.message);
    if(this.modal) {
      this.dataInfo = this.modal.message;
      console.log(this.dataInfo);

    }

  }

  close() {
    // /acc/my-account
    this.modal.close( {close: 'Close_Add_Account'});
    this.router.navigate(['/acc/my-account']);
  }

}
