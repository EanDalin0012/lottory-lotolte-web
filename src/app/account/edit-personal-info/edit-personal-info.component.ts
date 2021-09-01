import { Component, OnInit, ViewChild } from '@angular/core';
import { UserInfomation } from '../../shares/model/user';
import { Genders, BTN_ROLES } from '../../shares/constants/common.const';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from '../../shares/services/modal.service';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { HTTPService } from '../../shares/services/http.service';
import { environment } from 'src/environments/environment';
import { FileRestrictions, SelectEvent } from '@progress/kendo-angular-upload';
import * as moment from 'moment';
import { Base64WriteImage } from '../../shares/model/base64-image';
import { PipeUtils } from '../../shares/utils/pipe-utils';

@Component({
  selector: 'app-edit-personal-info',
  templateUrl: './edit-personal-info.component.html',
  styleUrls: ['./edit-personal-info.component.css']
})
export class EditPersonalInfoComponent implements OnInit {

  private baseUrl: string = '';

  @ViewChild("firstName") inputFirstName: any;
  @ViewChild("lastName") inputLastName: any;
  @ViewChild("phoneNumber") inputPhoneNumber: any;
  @ViewChild("userName") inputUserName: any;
  @ViewChild("pawword") inputPawword: any;

  modal:any;

  form: any;

  submitted = false;
  genderCheck = false;

  dateBirth: Date = new Date();
  userInfo: UserInfomation = {
    id: 0,
    firstName: '',
    lastName:'',
    userName: '',
    dateBirth: '',
    gender:'',
    resourceID: 0,
    phoneNumber: '',
    otherPhoneNumber: '',
    createDate: '',
    address: ''
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

  public fileRestrictions: FileRestrictions = {
    allowedExtensions: ['.jpg', '.png', '.jpeg']
  };
  imageUploaded: boolean = false;
  imagePreviewProfileID: number = 0;
  imagePreviewProfile: any[] = [];
  public value: Date = new Date();

  constructor(
    private translateService: TranslateService,
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private hTTPService: HTTPService,
  ) {
    this.baseUrl = environment.bizServer.server;

    this.form as FormGroup;

    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: new FormControl(new Date(2000, 10, 10)),
      phoneNumber: ['', Validators.required],
      otherPhoneNumber: [''],
      gender: new FormControl(),
      address: [''],

    });
  }

  ngOnInit(): void {

    if(this.modal) {
      this.userInfo = this.modal.message;
      this.imagePreviewProfileID = this.userInfo.resourceID;
      this.gender.code = this.userInfo.gender;
      this.gender.text = PipeUtils.gender(this.userInfo.gender);
      const year = +this.userInfo.dateBirth.substr(0, 4);
      const month= (+this.userInfo.dateBirth.substr(4,2) ) -1;
      const day= +this.userInfo.dateBirth.substr(6,2);

      this.form.patchValue({
        firstName: this.userInfo.firstName,
        lastName: this.userInfo.lastName,
        phoneNumber: this.userInfo.phoneNumber,
        otherPhoneNumber: this.userInfo.otherPhoneNumber,
        address: this.userInfo.address,
        gender: this.gender
      });

      this.value = new Date(year, month, day);

    }

  }

  close() {
    this.modal.close( {close: BTN_ROLES.CLOSE});
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
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
      case 'address':
        this.form.patchValue({
          address: ''
        });
        break;
    }
  }

  save() {
    this.submitted = true;
    if(this.f.gender.value == null) {
      this.genderCheck = true;
      return;
    }


    if(this.f.firstName.errors) {
      this.inputFirstName.nativeElement.focus();
    } else if (this.f.lastName.errors) {
      this.inputLastName.nativeElement.focus();
    } else if (this.f.gender.errors) {
      this.genderCheck = true;
    }else if (this.f.phoneNumber.errors) {
      this.inputPhoneNumber.nativeElement.focus();
    } else {
      const data = this.form.getRawValue();
      var dd = String(this.value.getDate()).padStart(2, '0');
      var mm = String(this.value.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = this.value.getFullYear();

      if(data.gender.code === '') {
        this.translateErrorServer('Invalid_Gender');
        return;
      }

      if(!this.value) {
        this.translateErrorServer('Invalid_DB');
        return;
      }
      // let createAccount = new CreateAccount();

      const personalInformation = {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender.code,
        dateBirth: yyyy+''+mm+''+dd,
        phoneNumber: data.phoneNumber,
        otherPhone: data.otherPhoneNumber,
        address: data.address,
        resourceID: this.imagePreviewProfileID,
        userID: this.userInfo.id
      };
      const api = this.baseUrl + '/api/user/v0/update/info';
      this.hTTPService.Post(api,personalInformation).then((resposne)=> {
        if( resposne && resposne.result.responseCode !== '200') {
          this.translateErrorServer(resposne.result.responseMessage);
        }
       if(resposne.body != null && resposne.body.responseCode === '200') {
          this.modal.close( {close: BTN_ROLES.CLOSE, responseCode: resposne.body.responseCode, personalInfo: personalInformation});
       }

     });

    }
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


  public remove(fileSelect:any, uid: string) {
    this.imageUploaded = false;
    fileSelect.removeFileByUid(uid);
    if(this.imagePreviewProfile.length > 0) {
      this.imagePreviewProfile.forEach((element,index) =>{
        if(element.uid === uid) {
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

  public onChange(value: Date): void {
    // var dd = String(value.getDate()).padStart(2, '0');
    // var mm = String(value.getMonth() + 1).padStart(2, '0'); //January is 0!
    // var yyyy = value.getFullYear();
    this.value = value;
  }

}
