/* Angular Version 6 below need to be deleted {providedIn: 'root'} */
/* angular */
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Result} from '../domain/result.domain';
/* owner */
import {FavoriteScript} from '../domain/favoritescript.domain';
import {DataList} from '../domain/datalist.domain';


@Injectable({
  providedIn: 'root'
})
export class FavoriteScriptMgeSvr {
  baseurl: string;
  header: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.baseurl = '/api/FavoriteScriptMgeSvr.rsfs/';
    this.header = new HttpHeaders().append('Urlencode-Type', 'PS1801');
  }

  Add(token: string, scriptId: string): Promise<FavoriteScript> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('token', token)
        .append('scriptId', scriptId.toString());
      this.httpClient.post<Result<FavoriteScript>>(this.baseurl + 'Add', httpParams, {headers: this.header}).subscribe(res => {
        if (res.code !== 0) {
          reject(res.msg);
        } else {
          resolve(new FavoriteScript(res.data));
        }
      }, err => {
        reject(err);
      });
    });
  }

  Delete(token: string, id: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('token', token)
        .append('id', id.toString());
      this.httpClient.post<Result<number>>(this.baseurl + 'Delete', httpParams, {headers: this.header}).subscribe(res => {
        if (res.code !== 0) {
          reject(res.msg);
        } else {
          resolve(res.data as number);
        }
      }, err => {
        reject(err);
      });
    });
  }

  QueryList(token: string, start: number, pageSize: number): Promise<DataList<FavoriteScript>> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('token', token)
        .append('start', start.toString())
        .append('pageSize', pageSize.toString());
      this.httpClient.post<Result<DataList<FavoriteScript>>>(this.baseurl + 'QueryList', httpParams, {headers: this.header}).subscribe(res => {
        if (res.code !== 0) {
          reject(res.msg);
        } else {
          resolve(new DataList<FavoriteScript>(res.data));
        }
      }, err => {
        reject(err);
      });
    });
  }
}
