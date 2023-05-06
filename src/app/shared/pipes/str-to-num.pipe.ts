import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'strtonum'
})
export class StrToNumPipe implements PipeTransform {

  transform(value: string | null): number {
    if (value == null || value == 'null') {
      return 0;
    } else {
      return +value;
    }
  }

}
