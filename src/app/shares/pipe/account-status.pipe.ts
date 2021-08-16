import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'accountStatus'
})
export class AccountStatusPipe implements PipeTransform {

  transform(value: string): string {
    return 'accountStatus-pipe';
  }

}