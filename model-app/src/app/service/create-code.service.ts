/* Angular Version 6 below need to be deleted {providedIn: 'root'} */
/* angular */
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Result} from '../domain/result.domain';
/* owner */
import {Domain} from '../domain/domain.domain';

@Injectable({
  providedIn: 'root'
})
export class CreateCodeSvr {
  baseurl: string;
  header: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.baseurl = '/code/getContent';
    this.header = new HttpHeaders().append('Urlencode-Type', 'PS1801');
  }

  Get(id: string, data: Domain): Promise<string> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('id', id)
        .append('data', JSON.stringify(data));
      this.httpClient.post<Result<string>>(this.baseurl , httpParams, {headers: this.header}).subscribe(res => {
        if (res.code !== 0) {
          reject(res.msg);
        } else {
          resolve(res.data);
        }
      }, err => {
        reject(err);
      });
    });
  }


}
