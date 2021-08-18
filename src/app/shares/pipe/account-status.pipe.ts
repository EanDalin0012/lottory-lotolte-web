import { TranslateService } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';
import { AccountStatus } from '../constants/common.const';

@Pipe({
  name: 'accountStatus'
})
export class AccountStatusPipe implements PipeTransform {

  constructor(
    private translateService: TranslateService
  ) {}
  transform(value: string): string {
    console.log(value);


    // let status = '<span class="badge bg-inverse-success">' + this.translateService.instant('Common.Label.otherStatus') + '</span>'; //'Other Status';
    switch (value) {
      case AccountStatus.Active:
        console.log('OK');
        //this.translateService.instant('Common.Label.active')
        return '<span class="badge bg-inverse-success">'+this.translateService.instant('Common.Label.active')+' </span>';
      case AccountStatus.Inactive:
        return '<span class="badge bg-inverse-danger">' + this.translateService.instant('Common.Label.inactive') + '</span>';
      default:
      return '<span class="badge bg-inverse-success">' + this.translateService.instant('Common.Label.otherStatus') + '</span>'; //'Other Status';
    }
  }

}
