import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalService } from '../../shares/services/modal.service';
import { DataService } from '../../shares/services/data.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from "ngx-toastr";
import { AllModulesService } from '../../shares/all-modules.service';
declare const $: any;
@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  lstOvertime: any[] = [];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};

  public rows:any[] = [];
  public srch:any[] = [];
  public statusValue: any;
  public dtTrigger: Subject<any> = new Subject();
  public pipe = new DatePipe("en-US");
  url: any = "overtime";
  public tempId: any;
  public editId: any;

  constructor(
    private modalService: ModalService,
    private dataService: DataService,
    private titleService: Title,
    private formBuilder: FormBuilder,
    // private toastr: ToastrService,
    private srvModuleService: AllModulesService,
  ) {
    this.titleService.setTitle('Account-Admin');
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: "lrtip",
    };
  }

  ngOnInit(): void {
    const url = (window.location.href).split('/');
    this.dataService.visitMessage(url[5]);
    this.inquiry();

    // for data table configuration
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: "lrtip",
    };
  }

  inquiry(){
    // this.srvModuleService.get(this.url).subscribe((data) => {
    //   console.log(data);
    //   this.lstOvertime = overtime;
    //   this.dtTrigger.next();
    //   this.rows = this.lstOvertime;
    //   this.srch = [...this.rows];
    // });
    this.lstOvertime = overtime;
      this.dtTrigger.next();
      this.rows = this.lstOvertime;
      this.srch = [...this.rows];
  }

  edit(value:any) {

  }

}
let overtime = [
  {
    id: 1,
    name: "Bernardo Galaviz",
    otDate: "08-03-2019",
    otHrs: "04",
    otType: "Normal day OT 1.5x",
    status: "New",
    approvedBy: "Richard Miles",
    description: "Lorem ipsum dollar",
  },
  {
    id: 2,
    name: "John Deo",
    otDate: "25-04-2019",
    otHrs: "07",
    otType: "Normal day OT 1.5x",
    status: "New",
    approvedBy: "Richard Miles",
    description: "Lorem ipsum dollar",
  },
  {
    id: 3,
    name: "Russia david",
    otDate: "12-09-2019",
    otHrs: "09",
    otType: "Normal day OT 1.5x",
    status: "New",
    approvedBy: "Richard Miles",
    description: "Lorem ipsum dollar",
  },
  {
    id: 4,
    name: "Mark hentry",
    otDate: "15-10-2019",
    otHrs: "02",
    otType: "Normal day OT 1.5x",
    status: "New",
    approvedBy: "Richard Miles",
    description: "Lorem ipsum dollar",
  },
  {
    id: 5,
    name: "Ruchared hentry",
    otDate: "23-04-2019",
    otHrs: "04",
    otType: "Normal day OT 1.5x",
    status: "New",
    approvedBy: "Richard Miles",
    description: "Lorem ipsum dollar",
  },
  {
    id: 6,
    name: "Mark rio",
    otDate: "11-07-2019",
    otHrs: "05",
    otType: "Normal day OT 1.5x",
    status: "New",
    approvedBy: "Richard Miles",
    description: "Lorem ipsum dollar",
  },
  {
    id: 7,
    name: "John Galaviz",
    otDate: "25-08-2019",
    otHrs: "08",
    otType: "Normal day OT 1.5x",
    status: "New",
    approvedBy: "Richard Miles",
    description: "Lorem ipsum dollar",
  },
  {
    id: 8,
    name: "Loren Gatlin",
    otDate: "05-01-2019",
    otHrs: "5",
    otType: "Normal day OT 1.5x",
    status: "New",
    approvedBy: "Richard Miles",
    description: "Lorem ipsum dollar",
  },
  {
    id: 9,
    name: "Tarah Shropshire",
    otDate: "05-01-2019",
    otHrs: "5",
    otType: "Normal day OT 1.5x",
    status: "New",
    approvedBy: "Richard Miles",
    description: "Lorem ipsum dollar",
  },
  {
    id: 10,
    name: "John Doe",
    otDate: "13-01-2019",
    otHrs: "5",
    otType: "Normal day OT 1.5x",
    status: "New",
    approvedBy: "Richard Miles",
    description: "Lorem ipsum dollar",
  },
  {
    id: 11,
    name: "John Smith",
    otDate: "20-01-2019",
    otHrs: "5",
    otType: "Normal day OT 1.5x",
    status: "New",
    approvedBy: "Richard Miles",
    description: "Lorem ipsum dollar",
  },
  {
    id: 12,
    name: "John Smith",
    otDate: "20-01-2019",
    otHrs: "5",
    otType: "Normal day OT 1.5x",
    status: "New",
    approvedBy: "Richard Miles",
    description: "Lorem ipsum dollar",
  },
];
