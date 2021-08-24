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
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private translate: TranslateService,
    private modalService: ModalService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if(err instanceof HttpErrorResponse) {
        console.log('my error', err);

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
