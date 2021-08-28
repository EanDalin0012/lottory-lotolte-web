import { Component, OnDestroy, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LOCAL_STORAGE, LANGUAGE } from './shares/constants/common.const';
import { Utils } from './shares/utils/utils.static';
import { environment } from 'src/environments/environment';
import { HTTPService } from './shares/services/http.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {



  title = 'LattoryLotoLTE';
  constructor(
    private hTTPService: HTTPService,
    private translate: TranslateService) {
    window.onbeforeunload = (event) => {
      const e = event || window.event;
      const requestData = {
        isClose: 'broswer is close'
      };
      // Cancel the event
      e.preventDefault();
      const api = environment.bizServer.server + '/api/client/v0/close';
        this.hTTPService.Post(api,requestData).then((resposne)=> {

       });
      if (e) {

        e.returnValue = ''; // Legacy method for cross browser support
      }
      return ''; // Legacy method for cross browser support
    };
    this.setInitialAppLanguage();
  }
  ngOnDestroy(): void {
   alert('close application');
  }

  // tslint:disable-next-line:typedef
  setInitialAppLanguage() {

    const i18n = Utils.getSecureStorage( LOCAL_STORAGE.I18N );
    if ( !i18n ) {
      Utils.setSecureStorage(LOCAL_STORAGE.I18N, LANGUAGE.I18N_EN.toString());
      this.translate.setDefaultLang( LANGUAGE.I18N_EN.toString() );
      this.translate.use( LANGUAGE.I18N_EN.toString() );
    } else {
      this.translate.setDefaultLang( 'en' );
      this.translate.use( i18n );
    }
  }
}
