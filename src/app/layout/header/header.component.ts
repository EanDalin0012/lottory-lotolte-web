import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from './header.service';
import { MessagesData } from '../../shares/model/messages-data';
import { Utils } from '../../shares/utils/utils.static';
import { TranslateService } from '@ngx-translate/core';
import { LOCAL_STORAGE } from '../../shares/constants/common.const';
import { environment } from 'src/environments/environment';
import { AuthentcatiionService } from '../../shares/services/authentcatiion.service';
import { DataService } from '../../shares/services/data.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private baseUrl: string = '';
  src = '';
  imageName = '';
  langCode  = this.translate.currentLang;
  langText  = 'English';
  langData          = {
    en: { class: "eng", text: "English"},
    kh: { class: "khmer", text: "ខ្មែរ"},
    ch: { class: "china", text: "中文"},
  };

  jsonData: any = {
    notification: [],
    message: [],
  };
  notifications: any;
  messagesData: MessagesData[] = [];
  flags = 'assets/img/flags/us.png';
  userInfo = {
    id: 0,
    dateBirth: '',
    firstName: '',
    gender: '',
    lastName: '',
    phoneNumber: '',
    userName: '',
    resourceID: 0
  };

  constructor(
    private translate: TranslateService,
    private headerService: HeaderService,
    private router: Router,
    private authentcatiionService: AuthentcatiionService,
    private dataService: DataService
    ) {
      this.baseUrl = environment.bizServer.server;

    }

  ngOnInit() {
      this.dataService.chageProfileData.subscribe(message => {
        if(message) {
          this.userInfo = message;
          this.src = this.baseUrl + '/api/image/reader/v0/read/'+this.userInfo.resourceID;
        }
      });

     switch(this.langCode) {
       case 'en':
        this.flags = 'assets/img/flags/us.png';
        this.langText = 'English';
         break;
      case 'kh':
        this.flags = 'assets/img/flags/kh.png';
        this.langText = 'ខ្មែរ';
        break;
      case 'ch':
        this.flags = 'assets/img/flags/cn.png';
        this.langText = '中文';
        break;
     }
    this.notifications = [
      {
        message: "Patient appointment booking",
        author: "John Doe",
        function: "added new task",
        time: "4 mins ago",
      },
      {
        message: "Patient appointment booking",
        author: "John Doe",
        function: "added new task",
        time: "1 hour ago",
      },
      {
        message: "Patient appointment booking",
        author: "John Doe",
        function: "added new task",
        time: "4 mins ago",
      },
      {
        message: "Patient appointment booking",
        author: "John Doe",
        function: "added new task",
        time: "1 hour ago",
      },
      {
        message: "Patient appointment booking",
        author: "John Doe",
        function: "added new task",
        time: "4 mins ago",
      },
      {
        message: "Patient appointment booking",
        author: "John Doe",
        function: "added new task",
        time: "1 hour ago",
      },
    ];

    this.messagesData = [
      {
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing",
        author: "Mike Litorus",
        time: "4 mins ago",
      },
      {
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing",
        author: "Mike Litorus",
        time: "1 hour ago",
      },
      {
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing",
        author: "Mike Litorus",
        time: "4 mins ago",
      },
      {
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing",
        author: "Mike Litorus",
        time: "1 hour ago",
      },
      {
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing",
        author: "Mike Litorus",
        time: "4 mins ago",
      },
      {
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing",
        author: "Mike Litorus",
        time: "1 hour ago",
      },
    ];
    this.userInfo = Utils.getSecureStorage(LOCAL_STORAGE.USER_INFO);
    this.src = this.baseUrl + '/api/image/reader/v0/read/'+this.userInfo.resourceID;
    this.imageName = this.userInfo.firstName + ' ' + this.userInfo.lastName;
  }

  getDatas(section: any) {
    this.headerService.getDataFromJson(section).subscribe((data: any) => {
      this.jsonData[section] = data;
    });
  }

  clearData(section: any) {
    this.jsonData[section] = [];
  }
  onSubmit() {
    this.router.navigate(["/pages/search"]);
  }

  onChangeLanguage(code: string) {
    this.langCode = code;
    if(code == 'en') {
      this.flags = 'assets/img/flags/us.png';
      this.langText = 'English';
    } else if (code == 'kh') {
      this.flags = 'assets/img/flags/kh.png';
      this.langText = 'ខ្មែរ';
    } else if (code == 'ch') {
      this.flags = 'assets/img/flags/cn.png';
      this.langText = '中文';
    }
    console.log(this.langCode, localStorage.I18N, code);
    Utils.setSecureStorage(LOCAL_STORAGE.I18N, this.langCode );
    this.translate.use( this.langCode );
  }

  logOut() {
    this.authentcatiionService.revokeToken().then(response => {
      console.log('response revokeToken:', response);

      // this.router.navigate(["/login"]);
    });

  }

  myProfile() {
    this.router.navigate(["/acc/profile"]);
  }
}
