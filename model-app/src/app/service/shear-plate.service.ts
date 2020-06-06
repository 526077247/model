import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShearPlateService {

  private content: string;
  private copyType: number;

  constructor() {
  }

  public set(content: string): void {
    this.content = content;
  }

  public get() {
    return this.content;
  }

  public settype(type: number): void {
    this.copyType = type;
  }

  public gettype() {
    return this.copyType;
  }
}
