import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private visitSource =  new BehaviorSubject<any>('');
  visitData = this.visitSource.asObservable();

  private visitSourceParamRoutorChange =  new BehaviorSubject<any>('');
  visitSourceParamRoutorChangeData = this.visitSourceParamRoutorChange.asObservable();

  private viewProductDetail =  new BehaviorSubject<any>('');
  viewProductDetailData = this.viewProductDetail.asObservable();

  private viewNewAccountClose =  new BehaviorSubject<any>('');
  viewNewAccountCloseData = this.viewNewAccountClose.asObservable();

  private chageProfile =  new BehaviorSubject<any>('');
  chageProfileData = this.chageProfile.asObservable();

  visitMessage(message: any) {
    this.visitSource.next(message);
  }

  visitParamRouterChange(message: any) {
    this.visitSourceParamRoutorChange.next(message);
  }

  viewProductDetailMessage(message: any) {
    this.viewProductDetail.next(message);
  }

  viewNewAccountCloseMessage(message: any) {
    this.viewNewAccountClose.next(message);
  }

  chageProfileDataMessage(message: any) {
    this.chageProfile.next(message);
  }

}
