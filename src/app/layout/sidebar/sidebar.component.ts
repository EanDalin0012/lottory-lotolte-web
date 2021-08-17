import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import * as $ from 'jquery';
import { UrlComplete } from '../../shares/model/url-complete';
import { Member } from '../../shares/model/members';
import { Group } from '../../shares/model/groups';
import { AccountType } from '../../shares/model/account-type';
import { AccountTypeCode, LOCAL_STORAGE } from '../../shares/constants/common.const';
import { DataService } from '../../shares/services/data.service';
import { Utils } from '../../shares/utils/utils.static';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  accountTypes: AccountType[] = accountTypes;

  urlComplete: UrlComplete = {
    mainUrl: '',
    childUrl: '',
    subUrl: ''
  };

  sidebarMenus = {
    default: true,
    chat: false,
    settings: false,
  };

  members: Member = {
    active: '',
    total: []
  };
  groups: Group;
  accountType ='';

  constructor(
    private router: Router,
    private dataService: DataService
  ) {
    // this.router.events.subscribe((event: Event) => {
    //   if (event instanceof NavigationEnd) {
    //     $(".main-wrapper").removeClass('slide-nav');
    //     $(".sidebar-overlay").removeClass('opened');
    //     const url = event.url.split("/");
    //     this.urlComplete.mainUrl = url[1];
    //     this.urlComplete.subUrl = url[2];
    //     this.urlComplete.childUrl = url[3];
    //     if (url[1] === "") {
    //       this.urlComplete.mainUrl = "dashboard";
    //       this.urlComplete.subUrl = "admin";
    //     }

    //     if (url[2] === "chat" || url[2] === "calls") {
    //       this.sidebarMenus.chat = true;
    //       this.sidebarMenus.default = false;
    //     } else {
    //       this.sidebarMenus.chat = false;
    //       this.sidebarMenus.default = true;
    //     }
    //   }
    // });

    this.groups = {
      active: "",
      total: ["general", "video responsive survey", "500rs", "warehouse"],
    };
    this.members = {
      active: "Mike Litorus",
      total: [
        { name: "John Doe", count: 3 },
        { name: "Richard Miles", count: 0 },
        { name: "John Smith", count: 7 },
        { name: "Mike Litorus", count: 9 },
      ],
    };
  }

  ngOnInit() {
    this.urlComplete.mainUrl = 'acc';
    this.urlComplete.subUrl = AccountTypeCode.Admin;

    this.dataService.visitSourceParamRoutorChangeData.subscribe(message => {
      let account_type = Utils.getSecureStorage(LOCAL_STORAGE.AccountTypeCode);
      let msg = '';
      console.log('this.account_type', account_type);
      console.log('message', message);
      if (message !== '') {
        msg = message;
      } else {
        this.accountType = account_type;
        msg = account_type;
      }
      this.activeSidebar(msg);
      // switch (msg) {
      //   case 'profile':
      //     this.urlComplete.mainUrl = 'acc'+message;
      //     this.urlComplete.subUrl = message;
      //     break;
      //   case 'acc':
      //     this.urlComplete.mainUrl = 'acc';
      //     this.urlComplete.subUrl = account_type;
      //     break;
      //   case 'my-account':
      //     this.urlComplete.mainUrl = 'my-account';
      //     this.urlComplete.subUrl = 'my-account';
      //     break;
      //   default:
      //     this.urlComplete.mainUrl = '';
      //     this.urlComplete.subUrl = account_type;
      //     break;
      // }
      console.log('this.urlComplete', this.urlComplete);
    });

    // Slide up and down of menus
    $(document).on("click", "#sidebar-menu a", function (e) {
      e.stopImmediatePropagation();
      if ($(this).parent().hasClass("submenu")) {
        e.preventDefault();
      }
      if (!$(this).hasClass("subdrop")) {
        $("ul", $(this).parents("ul:first")).slideUp(350);
        $("a", $(this).parents("ul:first")).removeClass("subdrop");
        $(this).next("ul").slideDown(350);
        $(this).addClass("subdrop");
      } else if ($(this).hasClass("subdrop")) {
        $(this).removeClass("subdrop");
        $(this).next("ul").slideUp(350);
      }
    });

    // this.dataService.visitData.subscribe(message => {
    //   if (message !== '') {
    //     setTimeout(() => {
    //       this.urlComplete.mainUrl = message;
    //       this.urlComplete.subUrl = message;
    //     });
    //   }
    // });

  }

  setActive(member:any) {
    // this.allModulesService.members.active = member;
  }

  routerAccount(accountType: AccountType) {
    this.urlComplete.mainUrl = 'acc';
    this.urlComplete.subUrl = accountType.code;
    Utils.setSecureStorage(LOCAL_STORAGE.AccountTypeCode, accountType.code);
    this.dataService.visitParamRouterChange('acc');
    this.onNavigateRoutor('/acc/');
  }

  onNavigateRoutor(router: string) {
    this.router.navigate([router]);
  }

  activeSidebar(msg: string) {
    console.log('msg', msg);
    switch (msg) {
      case 'profile':
        this.urlComplete.mainUrl = 'acc'+msg;
        this.urlComplete.subUrl = msg;
        break;
      case 'acc':
        let account_type = Utils.getSecureStorage(LOCAL_STORAGE.AccountTypeCode);
        this.urlComplete.mainUrl = 'acc';
        this.urlComplete.subUrl = account_type;
        break;
      case 'my-account':
        this.urlComplete.mainUrl = 'my-account';
        this.urlComplete.subUrl = 'my-account';
        break;
      default:
        this.urlComplete.mainUrl = '';
        this.urlComplete.subUrl = msg;
        break;
    }
  }

}

export const accountTypes: AccountType[] = [
  {
    id: 1,
    code: AccountTypeCode.Admin,
    name: 'Admin',
    remark: 'A'
  },
  {
    id: 2,
    code: AccountTypeCode.Senair,
    name: 'Senair',
    remark: 'A'
  },
  {
    id: 3,
    code: AccountTypeCode.Master,
    name: 'Master',
    remark: 'A'
  },
  {
    id: 4,
    code: AccountTypeCode.Agentcy,
    name: 'Agent',
    remark: 'A'
  },
  {
    id: 5,
    code: AccountTypeCode.Member,
    name: 'Member',
    remark: 'A'
  }
];
