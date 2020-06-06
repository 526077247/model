/* Angular Version 6 below need to be deleted {providedIn: 'root'} */
/* angular */
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Result} from '../domain/result.domain';
/* owner */
import {BuildingScript} from '../domain/buildingscript.domain';
import {DataList} from '../domain/datalist.domain';

@Injectable({
  providedIn: 'root'
})
export class BuildingScriptMgeSvr {
  baseurl: string;
  header: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.baseurl = '/api/BuildingScriptMgeSvr.rsfs/';
    this.header = new HttpHeaders().append('Urlencode-Type', 'PS1801');
  }

  Create(token: string, buildingScript: BuildingScript): Promise<BuildingScript> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('token', token)
        .append('buildingScript', JSON.stringify(buildingScript));
      this.httpClient.post<Result<BuildingScript>>(this.baseurl + 'Create', httpParams, {headers: this.header}).subscribe(res => {
        if (res.code !== 0) {
          reject(res.msg);
        } else {
          resolve(new BuildingScript(res.data));
        }
      }, err => {
        reject(err);
      });
    });
  }

  Update(token: string, id: string, buildingScript: BuildingScript): Promise<BuildingScript> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('token', token)
        .append('id', id)
        .append('buildingScript', JSON.stringify(buildingScript));
      this.httpClient.post<Result<BuildingScript>>(this.baseurl + 'Update', httpParams, {headers: this.header}).subscribe(res => {
        if (res.code !== 0) {
          reject(res.msg);
        } else {
          resolve(new BuildingScript(res.data));
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
        .append('id', id);
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

  Get(token: string, id: string): Promise<BuildingScript> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('token', token)
        .append('id', id);
      this.httpClient.post<Result<BuildingScript>>(this.baseurl + 'Get', httpParams, {headers: this.header}).subscribe(res => {
        if (res.code !== 0) {
          reject(res.msg);
        } else {
          resolve(new BuildingScript(res.data));
        }
      }, err => {
        reject(err);
      });
    });
  }

  QueryList(token: string, typeIN: string, start: number, pageSize: number, createTimeS?: string, createTimeE?: string): Promise<DataList<BuildingScript>> {
    return new Promise((resolve, reject) => {
      let httpParams = new HttpParams()
        .append('token', token)
        .append('typeIN', typeIN.toString())
        .append('start', start.toString())
        .append('pageSize', pageSize.toString());
      if (createTimeS !== undefined) {
        httpParams = httpParams.append('createTimeS', createTimeS.toString());
      }
      if (createTimeE !== undefined) {
        httpParams = httpParams.append('createTimeE', createTimeE.toString());
      }
      this.httpClient.post<Result<DataList<BuildingScript>>>(this.baseurl + 'QueryList', httpParams, {headers: this.header}).subscribe(res => {
        if (res.code !== 0) {
          reject(res.msg);
        } else {
          resolve(new DataList(res.data));
        }
      }, err => {
        reject(err);
      });
    });
  }

  QueryMyList(token: string, typeIN: string, start: number, pageSize: number, createTimeS?: string, createTimeE?: string): Promise<DataList<BuildingScript>> {
    return new Promise((resolve, reject) => {
      let httpParams = new HttpParams()
        .append('token', token)
        .append('typeIN', typeIN.toString())
        .append('start', start.toString())
        .append('pageSize', pageSize.toString());
      if (createTimeS !== undefined) {
        httpParams = httpParams.append('createTimeS', createTimeS.toString());
      }
      if (createTimeE !== undefined) {
        httpParams = httpParams.append('createTimeE', createTimeE.toString());
      }
      this.httpClient.post<Result<DataList<BuildingScript>>>(this.baseurl + 'QueryMyList', httpParams, {headers: this.header}).subscribe(res => {
        if (res.code !== 0) {
          reject(res.msg);
        } else {
          resolve(new DataList(res.data));
        }
      }, err => {
        reject(err);
      });
    });
  }

  QueryFavoriteList(token: string): Promise<BuildingScript[]> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('token', token);
      this.httpClient.post<Result<BuildingScript[]>>(this.baseurl + 'QueryFavoriteList', httpParams, {headers: this.header}).subscribe(res => {
        if (res.code !== 0) {
          reject(res.msg);
        } else {
          const tmp = [];
          for (const item of res.data) {
            tmp.push(new BuildingScript(item));
          }
          resolve(tmp);
        }
      }, err => {
        reject(err);
      });
    });
  }
}
