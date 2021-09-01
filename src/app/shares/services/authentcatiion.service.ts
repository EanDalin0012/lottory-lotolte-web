import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalService } from './modal.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { HTTPService } from './http.service';
import { environment } from 'src/environments/environment';
import { Utils } from '../utils/utils.static';
import { LOCAL_STORAGE } from '../constants/common.const';
import { DeviceInfo } from '../model/device-detector';

@Injectable({
  providedIn: 'root'
})
export class AuthentcatiionService {
  private baseUrl: string = '';

  constructor(
    private httpClient: HttpClient,
    private modalService: ModalService,
    private translate: TranslateService,
    private router: Router,
    private httpService: HTTPService
  ) {
    this.baseUrl = environment.bizServer.server;
  }

  public login(auth: AuthentcatiionRequest, basicAuth?: BasicAuth): Promise<any> {
    return new Promise((resovle) => {
      this.accessTokenRequest(auth, basicAuth).then(response => {
        console.log('response accessTokenRequest:', response);

        if (response.access_token) {
          Utils.setSecureStorage(LOCAL_STORAGE.Authorization, response);
          this.loadUserByUserName(auth.user_name, response.access_token).then((result) => {
            if (result) {
              Utils.setSecureStorage(LOCAL_STORAGE.USER_INFO, result.userInfo);
              Utils.setSecureStorage(LOCAL_STORAGE.Account_Info, result.accountInfo);
              resovle(result);
            }

          }).catch((err) => {

          });
        }
      });
    });

  }

  private loadUserByUserName(userName: string, accessToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const deviceInfo = Utils.getSecureStorage(LOCAL_STORAGE.DEVICE_INFO) as DeviceInfo;
      const userInfo = {
        userName: userName,
        deviceInfo: {
          userAgent: deviceInfo.userAgent,
          os: deviceInfo.os,
          browser: deviceInfo.browser,
          device: deviceInfo.device,
          osVersion: deviceInfo.osVersion,
          browserVersion: deviceInfo.browserVersion,
          deviceType: deviceInfo.deviceType,
          orientation: deviceInfo.orientation,
          networkIP: Utils.getSecureStorage(LOCAL_STORAGE.NekWorkIP),
        },



      };
      const lang = Utils.getSecureStorage(LOCAL_STORAGE.I18N);
      const httpOptionsObj = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      };
      const uri = this.baseUrl + '/api/user/v0/loadUser?lang=' + lang;

      $('div.loading').removeClass('none');
      $('body').removeClass('loaded');


      this.httpClient.post(uri, JSON.stringify(userInfo), {
        headers: new HttpHeaders(httpOptionsObj)
      }).subscribe( res => {
          $('body').addClass('loaded');
          $('div.loading').addClass('none');
          const responseData = res as any;
          if(responseData.result && responseData.result.responseCode !== '200') {
            this.modalService.alert(
              this.translate.instant('ServerResponseCode.Label.'+responseData.result.responseMessage),
             {
             modalClass: 'open-alert',
             btnText: this.translate.instant('Common.Button.Confirme'),
             callback: res => {
               Utils.removeSecureStorage(LOCAL_STORAGE.Authorization);
               Utils.removeSecureStorage(LOCAL_STORAGE.USER_INFO);
               this.router.navigate(['/login']);
             }
           });
          } else if (responseData.body !== null ) {
            resolve(responseData.body);
          }
      }, error => {
        console.log('error', error);
      });

    });
  }

  private accessTokenRequest(auth: AuthentcatiionRequest, basicAuth?: BasicAuth): Promise<any> {
    return new Promise((resovle) => {
      $('div.loading').removeClass('none');

      if (!auth.user_name || auth.user_name === null) {
        this.modalService.alert(
          this.translate.instant('COMMON.MESSAGE.InValid_User_Name'),
          {
          btnText: this.translate.instant('COMMON.BUTTON.CONFIRME'),
          callback: (res) => {},
        });
        return;
      }

      let credentail: BasicAuth;


      if (!basicAuth) {
        credentail = {
          User_name: 'spring-security-oauth2-read-write-client',
          password: 'spring-security-oauth2-read-write-client-password1234',
        };
      } else {
        credentail = basicAuth;
      }

      const api = '/oauth/token';
      const uri = this.baseUrl + api;
      console.log(uri);

      const btoa =
        'Basic ' +
        window.btoa(credentail.User_name + ':' + credentail.password);

      const httpOptionsObj = {
        Authorization: btoa
      };

      const formData = new FormData();
      formData.append('client_id', 'spring-security-oauth2-read-write-client');
      formData.append('grant_type', 'password');
      formData.append('username', auth.user_name);
      formData.append('password', auth.password);

      this.httpClient
        .post(uri, formData, {
          headers: new HttpHeaders(httpOptionsObj),
        })
        .subscribe((auth) => {
          $('div.loading').addClass('none');
          resovle(auth);
        });
    });
    }

    public revokeToken(): Promise<any> {
      return new Promise((resolve, reject) => {
        const userInfo = Utils.getSecureStorage(LOCAL_STORAGE.USER_INFO);
        const lang = Utils.getSecureStorage(LOCAL_STORAGE.I18N);
        const api  = "/api/oauth2/revoke-token";
        const uri = this.baseUrl + api + '?userId=' + userInfo.id + '&lang=' + lang;
        let authorization = Utils.getSecureStorage(LOCAL_STORAGE.Authorization);
        const access_token = authorization.access_token;
        const headers = {
          'Authorization': 'Bearer ' + access_token
        };

        this.httpClient.get(uri, {headers}).subscribe(rest => {
          const result = rest as any;
          if(result.body && result.body.responseCode === '200') {
            this.router.navigate(["/login"]);
            resolve(result.body);
          } else {
            reject();
          }
        });

      });
    }

}

export interface BasicAuth {
  User_name: string;
  password: string;
}

export interface AuthentcatiionRequest {
  grant_type?: string;
  user_name: string;
  password: string;
  client_id?: string;
}
