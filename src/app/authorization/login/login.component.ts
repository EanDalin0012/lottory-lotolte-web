import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountTypeCode, LOCAL_STORAGE } from '../../shares/constants/common.const';
import { DataService } from '../../shares/services/data.service';
import { Utils } from '../../shares/utils/utils.static';
import { AuthentcatiionService, AuthentcatiionRequest } from '../../shares/services/authentcatiion.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName: string = '';
  password: string = '';
  constructor(
    private dataService: DataService,
    private authentcatiionService: AuthentcatiionService,
    private router: Router) { }

  ngOnInit(): void {
    console.log();
  }

  routors() {
    Utils.setSecureStorage(LOCAL_STORAGE.AccountTypeCode, AccountTypeCode.Admin);
    this.dataService.visitParamRouterChange(AccountTypeCode.Admin);
    this.router.navigate(['/acc/my-account']);
  }

  isEmpty(value: string) {
    switch (value) {
      case 'u':
        this.userName = '';
        break;
    }
  }

  onLogin() {
    const logInfo: AuthentcatiionRequest = {
      user_name: 'admin@gmail.com',
      password: 'admin123'
    };
    this.authentcatiionService.login(logInfo).then((result: any) => {
      console.log(result);

    }).catch((err: any) => {
        console.log(err);

    });
  }
}
