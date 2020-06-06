/* Angular Version 6 below need to be deleted {providedIn: 'root'} */
/* angular */
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Result} from '../domain/result.domain';
/* owner */

import {DataList} from '../domain/datalist.domain';
import {Project} from '../domain/project.domain';


@Injectable({
  providedIn: 'root'
})
export class ProjectMgeSvr {
  baseurl: string;
  header: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.baseurl = '/api/ProjectMgeSvr.rsfs/';
    this.header = new HttpHeaders().append('Urlencode-Type', 'PS1801');
  }

  Create(token: string, project: Project): Promise<Project> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('token', token.toString())
        .append('project', JSON.stringify(project));
      this.httpClient.post<Result<Project>>(this.baseurl + 'Create', httpParams, {headers: this.header}).subscribe(res => {
        if (res.code !== 0) {
          reject(res.msg);
        } else {
          resolve(new Project(res.data));
        }
      }, err => {
        reject(err);
      });
    });
  }

  Get(token: string, id: string): Promise<Project> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('token', token.toString())
        .append('id', id.toString());
      this.httpClient.post<Result<Project>>(this.baseurl + 'Get', httpParams, {headers: this.header}).subscribe(res => {
        if (res.code !== 0) {
          reject(res.msg);
        } else {
          resolve(new Project(res.data));
        }
      }, err => {
        reject(err);
      });
    });
  }

  Update(token: string, id: string, project: Project): Promise<Project> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('token', token.toString())
        .append('id', id.toString())
        .append('project', JSON.stringify(project));
      this.httpClient.post<Result<Project>>(this.baseurl + 'Update', httpParams, {headers: this.header}).subscribe(res => {
        if (res.code !== 0) {
          reject(res.msg);
        } else {
          resolve(new Project(res.data));
        }
      }, err => {
        reject(err);
      });
    });
  }

  Delete(token: string, id: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('token', token.toString())
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

  // tslint:disable-next-line:variable-name
  QueryList(token: string, state_IN: string, start: number, pageSize: number, createTimeS?: string, createTimeE?: string): Promise<DataList<Project>> {
    return new Promise((resolve, reject) => {
      let httpParams = new HttpParams()
        .append('token', token.toString())
        .append('state_IN', state_IN.toString())
        .append('start', start.toString())
        .append('pageSize', pageSize.toString());
      if (createTimeS !== undefined) {
        httpParams = httpParams.append('createTimeS', createTimeS.toString());
      }
      if (createTimeE !== undefined) {
        httpParams = httpParams.append('createTimeE', createTimeE.toString());
      }
      this.httpClient.post<Result<DataList<Project>>>(this.baseurl + 'QueryList', httpParams, {headers: this.header}).subscribe(res => {
        if (res.code !== 0) {
          reject(res.msg);
        } else {
          resolve(new DataList<Project>(res.data));
        }
      }, err => {
        reject(err);
      });
    });
  }
}
