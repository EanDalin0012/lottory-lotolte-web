import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ModalService } from './modal.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../utils/utils.static';
import { environment } from '../../../environments/environment.prod';
import { AESINFO, LOCAL_STORAGE } from '../constants/common.const';

@Injectable({
  providedIn: 'root'
})
export class HTTPService {

  modal: any;
  data: any;
  private url: string = '';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(
    private httpClient: HttpClient,
    private modalService: ModalService,
    private router: Router,
    private translate: TranslateService,
  ) { }

  public Post(api: string, TrClass: any): Promise<any> {
    console.log('api', api);
    console.log('TrClass', TrClass);
    return new Promise((resolve, reject) => {
      const aesInfo: any = Utils.getSecureStorage(LOCAL_STORAGE.LAST_EVENT_TIME) || {};
      console.log(aesInfo);
      if (aesInfo && new Date().getTime() - aesInfo > environment.autoLogoutTime) {
        if (this.modal) {
          this.modal.close();
        }

        this.modalService.alert(
          'For security reason, sessions end after 10 minutes of inactivity.\n' +
            'Your are required to sign in if  you wish to continue to use our services.\n' +
            'Thank you for using.',
            {
              callback: () => {
                $('kendo-dialog').remove();
                Utils.removeSecureStorage(LOCAL_STORAGE.USER_INFO);
                Utils.removeSecureStorage(LOCAL_STORAGE.Authorization);
                this.router.navigate(['/login']);
              }
            }

        );

      } else {
        // $('div.loading').addClass('none');
        $('div.loading').removeClass('none');
        $('body').removeClass('loaded');

        const authorization = Utils.getSecureStorage(LOCAL_STORAGE.Authorization);
        const access_token = authorization.access_token;
        if (!access_token) {
          this.modalService.alert(
             '',
            {
            modalClass: 'open-alert',
            btnText: this.translate.instant('COMMON.BUTTON.CONFIRME'),
            callback: res => {
              Utils.removeSecureStorage(localStorage.Authorization);
              Utils.removeSecureStorage(localStorage.USER_INFO);
              this.router.navigate(['/login']);
            }
          });
          return;
        }

        const httpOptionsObj = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + access_token
        };
        console.log('httpOptionsObj', httpOptionsObj);

        const userInfo = Utils.getSecureStorage(LOCAL_STORAGE.USER_INFO);
        console.log(userInfo);

        const lang = Utils.getSecureStorage(LOCAL_STORAGE.I18N);
        const uri = this.url + api + '?userId=' + userInfo.id + '&lang=' + lang;

        const dataBody = JSON.stringify(TrClass);
        console.log('data', dataBody);
        // const encryptionData = this.cryptoService.encrypt(dataBody);
        // const requestData = {
        //   body: encryptionData.toString()
        // };

        this.data = this.httpClient.post(uri, dataBody, {
          headers: new HttpHeaders(httpOptionsObj)
        }).subscribe( res => {
            const newAesInfo: any = Utils.getSecureStorage(AESINFO.STORE) || {};
            newAesInfo.timestamp = new Date().getTime();
            Utils.setSecureStorage(AESINFO.STORE, newAesInfo);
            $('body').addClass('loaded');
            $('div.loading').addClass('none');
            const result = res as any;
            if (result) {
              const responseData = result; //JSON.parse(result);
              const rawData = responseData.body;
              // const decryptData = JSON.parse(this.cryptoService.decrypt(String(rawData)));
              if (rawData.error != null) {
                reject();
                // this.message(result.error.message);
              } else {
                resolve(rawData);
              }
            } else {
              reject();
            }
        }, error => {
          console.log(error);
        });
      }

    });
   }

   public Get(api: string, obj?: any): Promise<any> {
    return new Promise((resolve, reject) => {

      $('div.loading').removeClass('none');
      $('body').removeClass('loaded');
      const userInfo = Utils.getSecureStorage(localStorage.USER_INFO);
      const lang = Utils.getSecureStorage(localStorage.I18N);
      console.log('lang', lang);

      const uri = this.url + api + '?userId=' + userInfo.id + '&lang=' + lang;

      const authorization = Utils.getSecureStorage(localStorage.Authorization);

      const access_token = authorization.access_token;

      // if (!access_token) {
      //   this.modalService.alert({
      //     content: 'fadfadf',
      //     btnText: this.translate.instant('COMMON.BUTTON.CONFIRME'),
      //     callback: _res => {

      //     }
      //   });
      //   return;
      // }
      const headers = {
        Authorization: 'Bearer ' + access_token
      };

      console.log(uri);

      this.httpClient.get(uri, {headers}).subscribe(rest => {

        $('body').addClass('loaded');
        $('div.loading').addClass('none');
        const result = rest as any;
        console.log(rest);
        const responseData = result; //JSON.parse(result);
        const rawData = responseData.body;
        // const decryptData = JSON.parse(this.cryptoService.decrypt(String(rawData)));

        if (rawData.error != null) {
          this.message(result.error.message);
          reject();
        } else {
          resolve(rawData);
        }

      });
    });
  }

  private message(message: string) {
    this.modalService.alert(
      '<h2>' + message + '</h2>',
      {
      modalClass: 'pop_confirm open-alert',
      btnText: 'Confirm',
      callback: (res) => {
        return false;
      }
    });
  }

}
