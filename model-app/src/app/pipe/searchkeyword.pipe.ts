import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'keyword'
})
@Injectable()
export class SearchkeywordPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(val: string, keyword: string): any {
    // val为整个字符串，keyword为需要高亮的字符串
    const Reg = new RegExp(keyword, 'g'); // important
    if (val) {
      const objToStr = JSON.stringify(val);
      const res = objToStr.replace(Reg, `<a style="background:yellow;">${keyword}</a>`);
      return this.sanitizer.bypassSecurityTrustHtml(res);
    }
  }
}
