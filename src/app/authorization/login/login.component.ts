import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountTypeCode, LOCAL_STORAGE } from '../../shares/constants/common.const';
import { DataService } from '../../shares/services/data.service';
import { Utils } from '../../shares/utils/utils.static';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private router: Router) { }

  ngOnInit(): void {
    console.log();
  }

  routors() {
    Utils.setSecureStorage(LOCAL_STORAGE.AccountTypeCode, AccountTypeCode.Admin);
    this.dataService.visitParamRouterChange(AccountTypeCode.Admin);
    this.router.navigate(['/acc']);
  }

}
