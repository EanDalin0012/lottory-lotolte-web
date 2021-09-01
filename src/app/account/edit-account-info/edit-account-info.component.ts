import { Component, OnInit, ViewChild } from '@angular/core';
import { BTN_ROLES, Genders } from '../../shares/constants/common.const';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { UserInfomation } from '../../shares/model/user';
import { environment } from 'src/environments/environment';
import { CreateAccount } from '../../shares/model/create-account';
import { ModalService } from '../../shares/services/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { HTTPService } from '../../shares/services/http.service';

@Component({
  selector: 'app-edit-account-info',
  templateUrl: './edit-account-info.component.html',
  styleUrls: ['./edit-account-info.component.css']
})
export class EditAccountInfoComponent implements OnInit {

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
      birthDate: new FormControl(new Date(new Date().getFullYear() - 18, 10, 10)),
      phoneNumber: ['', Validators.required],
      otherPhoneNumber: [''],
      gender: new FormControl(),
      address: [''],

    });
  }

  ngOnInit(): void {
    console.log();
    if(this.modal) {
      this.userInfo = this.modal.message;
      console.log(this.userInfo);

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
    } else {
      const data = this.form.getRawValue();
      const db = data.birthDate as Date;
      if(data.gender.code === '') {
        this.translateErrorServer('Invalid_Gender');
        return;
      }
      // let createAccount = new CreateAccount();

      const personalInformation = {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender.code,
        dateBirth: db.getFullYear() + ''+db.getMonth() + ''+db.getDate(),
        phoneNumber: data.phoneNumber,
        otherPhone: data.otherPhoneNumber,
        userName: data.userName,
        password: data.password,
        address: data.address
      };


      console.log(personalInformation);
      const api = this.baseUrl + '';
      this.hTTPService.Post(api,personalInformation).then((resposne)=> {
        console.log('resposne', resposne);
        if( resposne && resposne.result.responseCode !== '200') {
          this.translateErrorServer(resposne.result.responseMessage);
        }
       if(resposne.body != null && resposne.body.status === 'Y' && resposne.result.responseCode === '200') {
          console.log('resposne', resposne);
          this.close();

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
}
