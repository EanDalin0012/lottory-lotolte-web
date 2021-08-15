import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from './header.service';
import { MessagesData } from '../../shares/model/messages-data';
import { Utils } from '../../shares/utils/utils.static';
import { TranslateService } from '@ngx-translate/core';
import { LOCAL_STORAGE } from '../../shares/constants/common.const';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  langCode  = this.translate.currentLang;
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

  constructor(
    private translate: TranslateService,
    private headerService: HeaderService, private router: Router) {}

  ngOnInit() {
    // this.getDatas("notification");
    // this.getDatas("message");

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
    } else if (code == 'kh') {
      this.flags = 'assets/img/flags/kh.png';
    } else if (code == 'ch') {
      this.flags = 'assets/img/flags/cn.png';
    }
    console.log(this.langCode, localStorage.I18N, code);
    Utils.setSecureStorage(LOCAL_STORAGE.I18N, this.langCode );
    this.translate.use( this.langCode );
  }

  logOut() {
    this.router.navigate(["/login"]);
  }

  myProfile() {
    this.router.navigate(["/acc/profile"]);
  }
}
