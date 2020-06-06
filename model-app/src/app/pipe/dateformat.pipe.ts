import {Pipe, PipeTransform} from '@angular/core';
import {Util} from '../share/class/util';

@Pipe({
  name: 'dateformat'
})
export class DateformatPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!!value) {
      const date = new Date(value);
      return Util.dateFormat(date, 'yyyy年MM月dd日');
    }
    return value;
  }

}
