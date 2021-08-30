import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from './modal.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {


  constructor(
    private translate: TranslateService,
    private modalService: ModalService,
    private router: Router,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          // console.log('event', event);

        },
        (error: HttpErrorResponse) => {
         //  console.log(error);
        }
      ),
      // Log when response observable either completes or errors
      finalize(() => {
        // const elapsed = Date.now() - started;
        // const msg = `${req.method} "${req.urlWithParams}" ${ok} in ${elapsed} ms.`;
        // console.log(msg);
      }),
      catchError(err => {
      if(err instanceof HttpErrorResponse) {
        // console.log('my error', err);
        $('body').addClass('loaded');
        $('div.loading').addClass('none');

        if (err && err.status === 0) {
          this.modalService.alert(
            'message : <span>Connection faile</span> status: ' + err.statusText,
            {
            modalClass: 'message-alert testing, open-alert',
            btnText: 'Confirm',
            callback: (res) => {
              return false;
            }
          });
        }
        if(err.status === 401) {
          console.log('err', err);
          if (err.error.error === 'invalid_token') {
            console.log(err.error.error_description);
            this.modalService.alert(
              this.translate.instant('ServerResponseCode.Label.Invalid_Token'),
             {
             modalClass: 'open-alert',
             btnText: this.translate.instant('Common.Button.Confirme'),
             callback: res => {
              localStorage.clear();
              this.router.navigate(['/login']);
             }
           });
          } else {
            this.translateErrorServer(err.error.error_description);
          //   console.log(err.error.error_description);
          //   this.modalService.alert(
          //     this.translate.instant('ServerResponseCode.Label.'+err.error.error_description),
          //    {
          //    modalClass: 'open-alert',
          //    btnText: this.translate.instant('Common.Button.Confirme'),
          //    callback: res => {

          //    }
          //  });
          }

        }
        if(err.status === 400) {
          // Handle unauthorized error
          // console.log("Unauthorized");
          // logout() user

        } else if(err.status === 500) {
          // Handler internal server error
          // console.log("Server is not responding.")
          // alert("Try after some time.")
        }
        // ......
      }
      return new Observable<HttpEvent<any>>();
    }));
  }

  translateErrorServer(tran: string) {
    let message = '';

    switch(tran) {
      case 'UserNameNotFound':
        message = this.translate.instant('ServerResponseCode.Label.UserNameNotFound');
        break;
      case 'UserLocked':
        message = this.translate.instant('ServerResponseCode.Label.UserLocked');
        break;
      case 'UserDisabled':
        message = this.translate.instant('ServerResponseCode.Label.UserDisabled');
        break;
      case 'UserExpired':
        message = this.translate.instant('ServerResponseCode.Label.UserExpired');
        break;
      case 'InvalidPassword':
        message = this.translate.instant('ServerResponseCode.Label.InvalidPassword');
        break;
      case '500':
        message = this.translate.instant('ServerResponseCode.Label.Server_Error');
        break;
    }
    this.modalService.alert(
      message,
     {
     modalClass: 'open-alert',
     btnText: this.translate.instant('Common.Button.Confirme'),
     callback: res => {

     }
   });

  }
}
