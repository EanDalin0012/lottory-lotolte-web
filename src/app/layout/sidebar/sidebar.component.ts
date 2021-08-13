import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import * as $ from 'jquery';
import { UrlComplete } from '../../shares/model/url-complete';
import { Member } from '../../shares/model/members';
import { Group } from '../../shares/model/groups';
import { AccountType } from '../../shares/model/account-type';

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

  constructor(
    private router: Router,
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        $(".main-wrapper").removeClass('slide-nav');
        $(".sidebar-overlay").removeClass('opened');
        const url = event.url.split("/");
        this.urlComplete.mainUrl = url[1];
        this.urlComplete.subUrl = url[2];
        this.urlComplete.childUrl = url[3];
        if (url[1] === "") {
          this.urlComplete.mainUrl = "dashboard";
          this.urlComplete.subUrl = "admin";
        }

        if (url[2] === "chat" || url[2] === "calls") {
          this.sidebarMenus.chat = true;
          this.sidebarMenus.default = false;
        } else {
          this.sidebarMenus.chat = false;
          this.sidebarMenus.default = true;
        }
      }
    });

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
  }

  setActive(member:any) {
    // this.allModulesService.members.active = member;
  }

  routerAccount(accountType: AccountType) {
    this.urlComplete.mainUrl = 'acc';
    this.urlComplete.subUrl = accountType.code;
    console.log(accountType);
  }

}

export const accountTypes: AccountType[] = [
  {
    id: 1,
    code: 'A100',
    name: 'Admin',
    remark: 'A'
  },
  {
    id: 2,
    code: 'B100',
    name: 'Senair',
    remark: 'A'
  },
  {
    id: 3,
    code: 'C100',
    name: 'Master',
    remark: 'A'
  },
  {
    id: 4,
    code: 'D100',
    name: 'Agent',
    remark: 'A'
  },
  {
    id: 5,
    code: 'E100',
    name: 'Member',
    remark: 'A'
  }
];
