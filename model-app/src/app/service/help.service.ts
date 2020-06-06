import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HelpMenu} from '../domain/helpmenu.domain';

@Injectable({
  providedIn: 'root'
})
export class HelpService {
  baseurl: string;
  header: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.baseurl = '/helpinfo/';
    this.header = new HttpHeaders().append('Urlencode-Type', 'PS1801');
  }

  GetMenu(): Promise<HelpMenu[]> {
    return new Promise((resolve, reject) => {
      this.httpClient.get<HelpMenu[]>(this.baseurl + 'menu.json', {headers: this.header}).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }


}
