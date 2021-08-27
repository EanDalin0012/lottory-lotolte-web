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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {


  constructor(
    private translate: TranslateService,
    private modalService: ModalService
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
          console.log(err.error.error_description);
          this.modalService.alert(
            this.translate.instant('ServerResponseCode.Label.'+err.error.error_description),
           {
           modalClass: 'open-alert',
           btnText: this.translate.instant('Common.Button.Confirme'),
           callback: res => {

           }
         });
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
}
