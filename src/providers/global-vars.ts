import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalVars provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GlobalVars {

  apiUrlPrefix:string = "https://ask.manytutors.com/api/";
  //apiUrlPrefix:string = "http://localhost:8100/api/";
  
  appVersion = "1.0";
  
  constructor() {
    console.log('Hello GlobalVars Provider');
  }

  public setApiUrlPrefix(value) {
    this.apiUrlPrefix = value;
  }

  public getApiUrlPrefix() {
    return this.apiUrlPrefix;
  }
}
