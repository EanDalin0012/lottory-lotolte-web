import { Component, OnInit } from '@angular/core';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { Account } from '../../shares/model/account';
import { Utils } from '../../shares/utils/utils.static';
import { LOCAL_STORAGE, BTN_ROLES } from '../../shares/constants/common.const';
import { accountDatas } from '../account-list/account-data';
import { TranslateService } from '@ngx-translate/core';
import { StepperActivateEvent } from '@progress/kendo-angular-layout';
import { FileRestrictions, FileState, SelectEvent } from '@progress/kendo-angular-upload';
import * as moment from 'moment';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {

  modal:any;
  typeList: any[] = [];
  categoryName = '';
  description = '';
  currenctAccount: string = '000-000-001';
  currenctAccountName: string = 'Ean Dalin';
  amount: number = 0.00;

  defaultAccount = {
    id: 0, accountId: '', accountName: 'Select Account', currency: '', accountType: '', status: '', accountBalace: 0
  };
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
  firstName:string = '';
  lastName: string = '';
  gender:string = '';
  dateBirth: Date = new Date();

  public fileRestrictions: FileRestrictions = {
    allowedExtensions: ['.jpg', '.png']
  };
  image_uploaded: boolean = false;
  public imagePreviews: any[] = [];

  constructor(
    private translateService: TranslateService
  ) {
    this.stepsIcons = [
      { label: 'Info',  isValid: true },
      { label: 'Info2', isValid: true }
    ];
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


}
