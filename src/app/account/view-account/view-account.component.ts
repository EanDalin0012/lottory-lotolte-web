import { Component, OnInit } from '@angular/core';
import { BTN_ROLES } from '../../shares/constants/common.const';

@Component({
  selector: 'app-view-account',
  templateUrl: './view-account.component.html',
  styleUrls: ['./view-account.component.css']
})
export class ViewAccountComponent implements OnInit {

  modal:any;
  constructor() { }

  ngOnInit(): void {
    console.log();

  }

  close() {
    this.modal.close( {close: BTN_ROLES.CLOSE});
  }

}
