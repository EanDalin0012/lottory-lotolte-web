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
  viewProductDetailData = this.visitSource.asObservable();

  visitMessage(message: any) {
    this.visitSource.next(message);
  }

  visitParamRouterChange(message: any) {
    this.visitSourceParamRoutorChange.next(message);
  }

  viewProductDetailMessage(message: any) {
    this.viewProductDetail.next(message);
  }



}
