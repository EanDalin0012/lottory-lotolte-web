import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { Account } from '../../shares/model/account';
import { Utils } from '../../shares/utils/utils.static';
import { LOCAL_STORAGE, BTN_ROLES } from '../../shares/constants/common.const';
import { accountDatas } from '../account-list/account-data';
import { TranslateService } from '@ngx-translate/core';
import { StepperActivateEvent } from '@progress/kendo-angular-layout';
import { FileRestrictions, FileState, SelectEvent } from '@progress/kendo-angular-upload';
import * as moment from 'moment';
import { ViewAccountComponent } from '../view-account/view-account.component';
import { ModalService } from '../../shares/services/modal.service';
import { CreateAccount } from '../../shares/model/create-account';
import { PersonalInformation } from '../../shares/model/personal-information';
import { UserAccount } from '../../shares/model/user-account';
import { IdentifyInformation } from '../../shares/model/identify-information';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@progress/kendo-angular-notification';
import ValidationForm from '../../shares/utils/validation-from';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {

  @ViewChild("firstName") inputFirstName: any;
  @ViewChild("lastName") inputLastName: any;
  @ViewChild("phoneNumber") inputPhoneNumber: any;
  @ViewChild("otherPhoneNumber") inputOtherPhoneNumber: any;
  @ViewChild("userName") inputUserName: any;



  modal:any;
  public horizontal = "right";
  public vertical = "top";

  typeList: any[] = [];
  categoryName = '';
  description = '';
  currenctAccount: string = '000-000-001';
  currenctAccountName: string = 'Ean Dalin';
  amount: number = 0.00;
  phoneNumber: string = '';
  otherPhone: string = '';
  password:string = '';
  confirmPawword: string = '';

  identifyImageUploaded: boolean = false;
  identifyImagePreviews:any[] = [];


  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };
  accounts:Account[] = [];
  account:Account = { id: 0, accountId: '', accountName: '', currency: '', accountType: '', status: '', accountBalace: 0};
  accountDisplay:Account[] = [];

  public stepsIcons = [
    {
      label: '',
      isValid: false
    }
  ];
  public currentStep = 0;

  dateBirth: Date = new Date();

  public fileRestrictions: FileRestrictions = {
    allowedExtensions: ['.jpg', '.png']
  };

  image_uploaded: boolean = false;
  public imagePreviews: any[] = [];

  gender = {
    code: '',
    text: '',
  };
  defaultGender = {
    code: '',
    text: 'Select Gender',
  }
  genders = [
    {
      code: 'm',
      text: 'Male',
    },
    {
      code: 'f',
      text: 'Female',
    }
  ];

  personalInformation  = new PersonalInformation();

  userAccount:UserAccount = {
    userName: '',
    password: ''
  };

  identifyInformation: IdentifyInformation = {
    identifyID: '',
    resourceID: ''
  }
  form: any;
  submitted = false;

  constructor(
    private translateService: TranslateService,
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private el: ElementRef,
    private notificationService: NotificationService
  ) {
    this.form as FormGroup;
    this.inputFirstName as ElementRef;
    this.inputLastName as ElementRef;
    this.inputPhoneNumber as ElementRef;
    this.inputOtherPhoneNumber as ElementRef;
    this.inputUserName as ElementRef;

    this.form = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        otherPhoneNumber: ['', Validators.required],
        userName: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20)
          ]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
        confirmPassword: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue]
      },
      {
        validators: [ValidationForm.match('password', 'confirmPassword')]
      }
    );

    this.stepsIcons = [
      { label: 'Info',  isValid: true },
      { label: 'Info2', isValid: true }
    ];
   }

   get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit(): void {
    console.log();
    const account_type = Utils.getSecureStorage(LOCAL_STORAGE.AccountTypeCode);
    console.log('account_type', account_type);
    const accountType = account_type;

    this.accounts = accountDatas;
      this.accountDisplay = [];
      this.accounts.forEach(element => {
        if(accountType == element.accountType) {
          this.accountDisplay.push(element);
        }
    });
  }

  close() {
    this.modal.close( {close: BTN_ROLES.CLOSE});
  }

  onClickBtnMainCategoryName() {
      this.categoryName = '';
  }

  onClickBtndescription() {
    this.description = '';
  }

  public onStepActivate(ev: StepperActivateEvent): void {
    if (ev.index === this.stepsIcons.length - 1) {
        ev.preventDefault();
        this.currentStep =  this.stepsIcons.length - 1;
        console.log('Please fill previous steps');
    }
    console.log(`Step ${ev.index} was activated`);
    console.log(ev);
  }

    // end file select function
  public prev(): void {
    this.currentStep -= 1;
  }

  public next(value: number): void {
    console.log(value);
    this.currentStep += 1;
    if(value === 0) {
      // if(this.checkUserInfo()) {
      //   this.stepsIcons[0].isValid =  true;
      //   this.stepsIcons[1].isValid =  true;
      //   this.currentStep += 1;
      // } else {
      //   this.stepsIcons[0].isValid =  false;
      // }
    } else if (value === 1) {
      this.currentStep += 1;
    }
  }

  // file select function
  public selectEventHandler(e: SelectEvent): void {
    this.image_uploaded = false;

    const that = this;
    e.files.forEach((file: any) => {

    if (!file.validationErrors) {
        const reader = new FileReader();
        reader.onload = function (ev:any) {

        const image = {
            src: ev.target['result']+"",
            uid: file.uid,
            id: file.uid +"-"+moment().format('YYYYMMDDhhmmss'),
            name: file.name,
            size: file.size,
            type: file.rawFile.type,
            extension: file.extension
        };
        that.imagePreviews.push(image);

        };
        reader.readAsDataURL(file.rawFile);

    }

    });
  }

  public showButton(state: FileState): boolean {
    return (state === FileState.Selected) ? true : false;
  }

  public remove(fileSelect:any, uid: string) {
    this.image_uploaded = false;
    fileSelect.removeFileByUid(uid);
    if(this.imagePreviews.length > 0) {
      this.imagePreviews.forEach((element,index) =>{
        if(element.uid === uid) {
            console.log("call add function", element, index);
            this.imagePreviews.splice(index, 1);
        }
      });
    }
  }

  upload(state:any, value: string): boolean {
    console.log(this.imagePreviews);
    if(value === 'f'){
      return false;
    } else if(value === 't') {
      if(this.imagePreviews.length > 0) {
        this.imagePreviews.forEach(element =>{
          if(element.uid === state) {
              let splitted = element.src.split(',');
              // const base64WriteImage = new Base64WriteImage();
              console.log('splitted', splitted)
              // if(splitted[1]) {
              //   base64WriteImage.id         = element.id;
              //   base64WriteImage.base64     = splitted[1];
              //   base64WriteImage.file_name  = element.name;
              //   base64WriteImage.file_type  = element.type;
              //   base64WriteImage.file_size  = element.size;
              //   base64WriteImage.file_extension = element.extension;
              //   this.uploadService.upload(base64WriteImage).then(resp=>{
              //     if(resp === true) {
              //       this.resource_img_id_list.push({resource_id: base64WriteImage.id});
              //       console.log('resource_img_id', this.resource_img_id_list);
              //       this.modalService.showNotificationService(this.translateService.instant('Uploaded Image name:'+element.name), 900,'notification-profile upload-product-image');
              //      return true;
              //     }
              //   });
              // }
          }
        });
      } else {
        return false;
      }
      return true;
    } else {
      return false;
    }

  }



  // file select function
  public selectIdentifyEventHandler(e: SelectEvent): void {
    this.identifyImageUploaded = false;

    const that = this;
    e.files.forEach((file: any) => {

    if (!file.validationErrors) {
        const reader = new FileReader();
        reader.onload = function (ev:any) {

        const image = {
            src: ev.target['result']+"",
            uid: file.uid,
            id: file.uid +"-"+moment().format('YYYYMMDDhhmmss'),
            name: file.name,
            size: file.size,
            type: file.rawFile.type,
            extension: file.extension
        };
        that.identifyImagePreviews.push(image);

        };
        reader.readAsDataURL(file.rawFile);
    }

    });
  }
  public removeIdentify(fileSelect:any, uid: string) {
    this.identifyImageUploaded = false;
    fileSelect.removeFileByUid(uid);
    if(this.identifyImagePreviews.length > 0) {
      this.identifyImagePreviews.forEach((element,index) =>{
        if(element.uid === uid) {
            console.log("call add function", element, index);
            this.identifyImagePreviews.splice(index, 1);
        }
      });
    }
  }

  uploadIdentifyImage(state:any, value: string): boolean {
    console.log(this.identifyImagePreviews);
    if(value === 'f'){
      return false;
    } else if(value === 't') {
      if(this.identifyImagePreviews.length > 0) {
        this.identifyImagePreviews.forEach(element =>{
          if(element.uid === state) {
              let splitted = element.src.split(',');
              // const base64WriteImage = new Base64WriteImage();
              console.log('splitted', splitted)
              // if(splitted[1]) {
              //   base64WriteImage.id         = element.id;
              //   base64WriteImage.base64     = splitted[1];
              //   base64WriteImage.file_name  = element.name;
              //   base64WriteImage.file_type  = element.type;
              //   base64WriteImage.file_size  = element.size;
              //   base64WriteImage.file_extension = element.extension;
              //   this.uploadService.upload(base64WriteImage).then(resp=>{
              //     if(resp === true) {
              //       this.resource_img_id_list.push({resource_id: base64WriteImage.id});
              //       console.log('resource_img_id', this.resource_img_id_list);
              //       this.modalService.showNotificationService(this.translateService.instant('Uploaded Image name:'+element.name), 900,'notification-profile upload-product-image');
              //      return true;
              //     }
              //   });
              // }
          }
        });
      } else {
        return false;
      }
      return true;
    } else {
      return false;
    }

  }

  save() {
    this.submitted = true;
    if(this.f.firstName.errors) {
      this.inputFirstName.nativeElement.focus();
    } else if (this.f.lastName.errors) {
      this.inputLastName.nativeElement.focus();
    } else if (this.f.phoneNumber.errors) {
      this.inputPhoneNumber.nativeElement.focus();
    } else if (this.f.otherPhoneNumber.errors) {
      this.inputOtherPhoneNumber.nativeElement.focus();
    } else if (this.f.userName.errors) {
      this.inputUserName.nativeElement.focus();
    }


    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
      ".ng-invalid"
    );
    window.scroll({
      top: this.getTopOffset(firstInvalidControl),
      left: 0,
      behavior: "smooth"
    });
    console.log(this.form.value.firstName);

    console.log(JSON.stringify(this.form.value, null, 2));
    if (this.form.invalid) {
      return;
    }

    console.log(JSON.stringify(this.form.value, null, 2));
    console.log(this.personalInformation);

    let createAccount = new CreateAccount();
    createAccount.personalInformation = this.personalInformation;
    console.log(createAccount);

    // this.close();
    // this.viewAccountInfo();
  }

  viewAccountInfo() {
    this.modalService.open(
      ViewAccountComponent,
      {
        callback: _response => {

      }
    });
  }

  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 50;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }

  public showNotification(): void {
    this.inputFirstName.nativeElement.focus();

    // this.notificationService.show({
    //   content: `Hi! I am info notification with position set to { horizontal: ${this.horizontal}, vertical: ${this.vertical} }`,
    //   animation: { type: "fade", duration: 8000000000 },
    //   type: { style: "info", icon: true },
    //   position: { horizontal: 'right', vertical: 'bottom' },
    // });
  }

}
