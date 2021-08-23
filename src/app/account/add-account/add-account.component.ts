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
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@progress/kendo-angular-notification';
import { PipeUtils } from '../../shares/utils/pipe-utils';
import { Base64WriteImage } from '../../shares/model/base64-image';
import { ErrorCodes } from '../../shares/constants/common.error.code.const';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {

  @ViewChild("firstName") inputFirstName: any;
  @ViewChild("lastName") inputLastName: any;
  @ViewChild("phoneNumber") inputPhoneNumber: any;
  @ViewChild("userName") inputUserName: any;
  @ViewChild("pawword") inputPawword: any;



  modal:any;
  currentAccount: string = '';
  public horizontal = "right";
  public vertical = "top";

  typeList: any[] = [];
  description = '';

  identifyImageUploaded: boolean = false;
  identifyImageUploadedID: string = '';
  identifyImagePreviews:any[] = [];

  imageUploaded: boolean = false;
  imagePreviewProfileId: string = '';
  imagePreviewProfile: any[] = [];


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

  currentDate: Date = new Date();
  dateBirth: Date = new Date();

  public fileRestrictions: FileRestrictions = {
    allowedExtensions: ['.jpg', '.png']
  };


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
  genderCheck = false;

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
    this.inputUserName as ElementRef;
    this.inputPawword as ElementRef;

    this.form = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        otherPhoneNumber: ['', Validators.required],
        gender: new FormControl(),
        remark: [''],
        identifyID: [''],
        userName: [
          '',
          [
            Validators.required
          ]
        ],
        password: [
          {value: '', disabled: true},
          [
            Validators.required, Validators.minLength(6),Validators.maxLength(40)
          ]
        ]
      },


    );
    // const year = this.currentDate.getFullYear();
    // const month = this.currentDate.getMonth();
    // const day = this.currentDate.getDay();
    // this.dateBirth.setDate(day);
    // this.dateBirth.setFullYear(year);
    // this.dateBirth.setMonth(month);


    this.stepsIcons = [
      { label: 'Info',  isValid: true },
      { label: 'Info2', isValid: true }
    ];
   }

   get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit(): void {

    if(this.modal.message) {
      this.currentAccount = PipeUtils.account(this.modal.message.accountID) + ','+ this.modal.message.acountName;
    }

    const account_type = Utils.getSecureStorage(LOCAL_STORAGE.AccountTypeCode);
    const accountType = account_type;

    this.accounts = accountDatas;
      this.accountDisplay = [];
      this.accounts.forEach(element => {
        if(accountType == element.accountType) {
          this.accountDisplay.push(element);
        }
    });

    this.form.patchValue({
      password: this.generatePassword(8)+''
    });

  }

  close() {
    this.modal.close( {close: BTN_ROLES.CLOSE});
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
    this.imageUploaded = false;

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
        that.imagePreviewProfile.push(image);

        };
        reader.readAsDataURL(file.rawFile);

    }

    });
  }

  public showButton(state: FileState): boolean {
    return (state === FileState.Selected) ? true : false;
  }

  public remove(fileSelect:any, uid: string) {
    this.imageUploaded = false;
    fileSelect.removeFileByUid(uid);
    if(this.imagePreviewProfile.length > 0) {
      this.imagePreviewProfile.forEach((element,index) =>{
        if(element.uid === uid) {
            console.log("call add function", element, index);
            this.imagePreviewProfile.splice(index, 1);
        }
      });
    }
  }

  uploadProfileImage(state:any, value: string): boolean {
    if(value === 'f'){
      return false;
    } else if(value === 't') {
      if(this.imagePreviewProfile.length > 0) {
        this.imagePreviewProfile.forEach(element =>{
          if(element.uid === state) {
              let splitted = element.src.split(',');
              const base64WriteImage = new Base64WriteImage();
              if(splitted[1]) {
                base64WriteImage.id         = element.id;
                base64WriteImage.base64     = splitted[1];
                base64WriteImage.file_name  = element.name;
                base64WriteImage.file_type  = element.type;
                base64WriteImage.file_size  = element.size;
                base64WriteImage.file_extension = element.extension;
                console.log(base64WriteImage);

                // this.uploadService.upload(base64WriteImage).then(resp=>{
                //   if(resp === true) {
                //     this.resource_img_id_list.push({resource_id: base64WriteImage.id});
                //     console.log('resource_img_id', this.resource_img_id_list);
                //     this.modalService.showNotificationService(this.translateService.instant('Uploaded Image name:'+element.name), 900,'notification-profile upload-product-image');
                //    return true;
                //   }
                // });
              }
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
    if(value === 'f'){
      return false;
    } else if(value === 't') {
      if(this.identifyImagePreviews.length > 0) {
        this.identifyImagePreviews.forEach(element =>{
          if(element.uid === state) {
              let splitted = element.src.split(',');
              const base64WriteImage = new Base64WriteImage();
              if(splitted[1]) {
                base64WriteImage.id         = element.id;
                base64WriteImage.base64     = splitted[1];
                base64WriteImage.file_name  = element.name;
                base64WriteImage.file_type  = element.type;
                base64WriteImage.file_size  = element.size;
                base64WriteImage.file_extension = element.extension;
                // this.uploadService.upload(base64WriteImage).then(resp=>{
                //   if(resp === true) {
                //     this.resource_img_id_list.push({resource_id: base64WriteImage.id});
                //     console.log('resource_img_id', this.resource_img_id_list);
                //     this.modalService.showNotificationService(this.translateService.instant('Uploaded Image name:'+element.name), 900,'notification-profile upload-product-image');
                //    return true;
                //   }
                // });
              }
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
    if(this.f.gender.value == null) {
      this.genderCheck = true;
    }


    if(this.f.firstName.errors) {
      this.inputFirstName.nativeElement.focus();
    } else if (this.f.lastName.errors) {
      this.inputLastName.nativeElement.focus();
    } else if (this.f.phoneNumber.errors) {
      this.inputPhoneNumber.nativeElement.focus();
    } else if (this.f.userName.errors) {
      this.inputUserName.nativeElement.focus();
    } else if (this.f.password.errors) {
      this.inputPawword.nativeElement.focus();
    }  else {
      const data = this.form.getRawValue();
      console.log('value', data.firstName);
      console.log(this.dateBirth);
      console.log(JSON.stringify(this.form.value));

      let createAccount = new CreateAccount();

      createAccount.personalInformation = {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender.code,
        dateBirth: data.dateBirth,
        phoneNumber: data.phoneNumber,
        otherPhone: data.otherPhoneNumber,
        resourceId: ''
      };
      createAccount.userAccount = {
        userName: data.userName,
        password: data.password
      };
      createAccount.identifyInformation = {
        identifyID: data.identifyID,
        resourceID: ''
      };
      console.log(createAccount);

    }

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

  onChangeGender(event: any) {
    if(event.code == '') {
      this.genderCheck = true;
    } else {
      this.genderCheck = false;
    }

  }

  isEmpty(code: string) {
    switch(code) {
      case 'firstName':
        this.form.patchValue({
          firstName: ''
        });
        break;
      case 'lastName':
        this.form.patchValue({
          lastName: ''
        });
        break;
      case 'phoneNumber':
        this.form.patchValue({
          phoneNumber: ''
        });
        break;
      case 'otherPhoneNumber':
        this.form.patchValue({
          otherPhoneNumber: ''
        });
        break;
      case 'userName':
        this.form.patchValue({
          userName: ''
        });
        break;
      case 'password':
        this.form.patchValue({
          password: ''
        });
        break;
      case 'confirmPawword':
        this.form.patchValue({
          confirmPawword: ''
        });
        break;
      case 'remark':
        this.form.patchValue({
          remark: ''
        });
        break;
    }
  }

  generatePassword(passwordLength: number) {
    var numberChars = "0123456789";
    var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lowerChars = "abcdefghijklmnopqrstuvwxyz";
    var allChars = numberChars + upperChars + lowerChars;
    var randPasswordArray = Array(passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray = randPasswordArray.fill(allChars, 3);
    return this.shuffleArray(randPasswordArray.map(function(x) { return x[Math.floor(Math.random() * x.length)] })).join('');
  }

  shuffleArray(array: any []) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  testing() {
    ErrorCodes.f.firstName;
  }
}
