import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { Account } from '../../shares/model/account';
import { Utils } from '../../shares/utils/utils.static';
import { LOCAL_STORAGE, BTN_ROLES, Genders } from '../../shares/constants/common.const';
import { accountDatas } from '../account-list/account-data';
import { TranslateService } from '@ngx-translate/core';
import { StepperActivateEvent } from '@progress/kendo-angular-layout';
import { FileRestrictions, FileState, SelectEvent } from '@progress/kendo-angular-upload';
import * as moment from 'moment';
import { ViewAccountComponent } from '../view-account/view-account.component';
import { ModalService } from '../../shares/services/modal.service';
import { CreateAccount } from '../../shares/model/create-account';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@progress/kendo-angular-notification';
import { PipeUtils } from '../../shares/utils/pipe-utils';
import { Base64WriteImage } from '../../shares/model/base64-image';
import { ErrorCodes } from '../../shares/constants/common.error.code.const';
import { HTTPService } from '../../shares/services/http.service';
import { environment } from 'src/environments/environment';
import { ShowAddAccountComponent } from '../show-add-account/show-add-account.component';
import { DataService } from '../../shares/services/data.service';
import { GeneratePasswordUtils } from '../../shares/utils/generate-password-util';
@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {

  private baseUrl: string = '';

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

  identifyImageUploaded: boolean = false;
  identifyImageUploadedID: number = 0;
  identifyImagePreviews:any[] = [];

  imageUploaded: boolean = false;
  imagePreviewProfileID: number = 0;
  imagePreviewProfile: any[] = [];


  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };
  accounts:Account[] = [];
  account:Account = { id: 0, accountID: '', accountName: '', currency: '', accountType: '', status: '', accountBalance: 0};
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
  genders = Genders;



  form: any;
  submitted = false;
  genderCheck = false;

  mainAccountInfo: Account = {
    id: 0,
    accountID: '',
    accountName: '',
    accountBalance: 0,
    accountType: '',
    status:'',
    currency: ''
  };
  openAccounttype: string = '';

  constructor(
    private translateService: TranslateService,
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private el: ElementRef,
    private hTTPService: HTTPService,
  ) {
    this.baseUrl = environment.bizServer.server;

    this.form as FormGroup;
    this.inputFirstName as ElementRef;
    this.inputLastName as ElementRef;
    this.inputPhoneNumber as ElementRef;
    this.inputUserName as ElementRef;
    this.inputPawword as ElementRef;

    this.form = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        birthDate: new FormControl(new Date(new Date().getFullYear() - 18, 10, 10)),
        phoneNumber: ['', Validators.required],
        otherPhoneNumber: ['', Validators.required],
        gender: new FormControl(),
        remark: [''],
        address: [''],
        identifyID: [''],
        userName: [
          '',
          [
            Validators.required
          ]
        ],
        password: [
          {value: ''},
          [
            Validators.required, Validators.minLength(6),Validators.maxLength(40)
          ]
        ]
      });

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
      this.mainAccountInfo = this.modal.message.accountInfo;
      this.openAccounttype = this.modal.message.openAccount;
      this.currentAccount = PipeUtils.account(this.mainAccountInfo.accountID) + ','+ this.mainAccountInfo.accountName;
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
      password: GeneratePasswordUtils.generate(8)
    });

  }

  close() {
    this.modal.close( {close: BTN_ROLES.CLOSE});
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

  // public next(value: number): void {
  //   console.log(value);
  //   this.currentStep += 1;
  //   if(value === 0) {
  //   } else if (value === 1) {
  //     this.currentStep += 1;
  //   }
  // }

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
                const api = this.baseUrl + '/api/base64/image/v0/write';
                this.hTTPService.Post(api, base64WriteImage).then(resp=>{
                  console.log(resp);

                  if(resp.body.status === 'Y') {
                    this.identifyImageUploadedID = resp.body.resourceID;
                  }
                });
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
                const api = this.baseUrl + '/api/base64/image/v0/write';
                this.hTTPService.Post(api, base64WriteImage).then(resp=>{
                  if(resp.body.status === 'Y') {
                    this.imagePreviewProfileID = resp.body.resourceID;
                  }
                });
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
    console.log(this.form.getRawValue());
    const t = this.form.getRawValue();
    const db = t.birthDate as Date;
    console.log(db, db.getFullYear(), db.getMonth(), db.getDate());

    if(this.f.gender.value == null) {
      this.genderCheck = true;
    }


    if(this.f.firstName.errors) {
      this.inputFirstName.nativeElement.focus();
    } else if (this.f.lastName.errors) {
      this.inputLastName.nativeElement.focus();
    } else if (this.f.gender.errors) {
      this.genderCheck = true;
    }else if (this.f.phoneNumber.errors) {
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
      const db = data.birthDate as Date;
      if(data.gender.code === '') {
        this.translateErrorServer('Invalid_Gender');
        return;
      }
      let createAccount = new CreateAccount();

      createAccount.personalInformation = {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender.code,
        dateBirth: db.getFullYear() + ''+db.getMonth() + ''+db.getDate(),
        phoneNumber: data.phoneNumber,
        otherPhone: data.otherPhoneNumber,
        resourceID: this.imagePreviewProfileID,
        userName: data.userName,
        password: data.password,
        accountType: this.openAccounttype,
        currency: 'KH',
        mainAccountID: this.mainAccountInfo.id,
        address: data.address
      };
      createAccount.identifyInformation = {
        identifyID: data.identifyID,
        resourceID: this.identifyImageUploadedID
      };
      createAccount.remark = data.remark;

      console.log(createAccount);
      const api = this.baseUrl + '/api/account/v0/save';
      this.hTTPService.Post(api,createAccount).then((resposne)=> {
        if( resposne && resposne.result.responseCode !== '200') {
          this.translateErrorServer(resposne.result.responseMessage);
        }
       if(resposne.body != null && resposne.body.status === 'Y' && resposne.result.responseCode === '200') {
          this.close();
          this.modalService.open(
            ShowAddAccountComponent,
            {
            message: { createAccountType: this.openAccounttype, resposne: resposne.body },
            callback: _response => {
            }
          });
       }

     });

    }

  }

  viewAccountInfo() {
    this.modalService.open(
      ViewAccountComponent,
      {
        callback: _response => {

      }
    });
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


  testing() {
    ErrorCodes.f.firstName;
  }

  translateErrorServer(tran: string) {
    let message = '';

    switch(tran) {
      case 'Invalid_FirstName':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_FirstName');
        break;
      case 'Invalid_LastName':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_LastName');
        break;
      case 'Invalid_Password':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_Password');
        break;
      case 'Invalid_Gender':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_Gender');
        break;
      case 'Invalid_DB':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_DB');
        break;
      case 'Invalid_UserName':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_UserName');
        break;
      case 'Invalid_AccountType':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_AccountType');
        break;
      case 'Invalid_Currency':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_Currency');
        break;
      case 'Invalid_MainAccountID':
        message = this.translateService.instant('ServerResponseCode.Label.Invalid_MainAccountID');
        break;
      case 'User_Had':
        message = this.translateService.instant('ServerResponseCode.Label.User_Had');
        break;
      case '500':
        message = this.translateService.instant('ServerResponseCode.Label.Server_Error');
        break;
    }
    this.modalService.alert(
      message,
     {
     modalClass: 'open-alert',
     btnText: this.translateService.instant('Common.Button.Confirme'),
     callback: res => {

     }
   });

  }
}
