import { Injectable } from '@angular/core';
import { InAppBrowser/*, Device*/ } from 'ionic-native';

import { GlobalVars } from './global-vars';
import { AuthService } from './auth';

/*
  Generated class for the Web provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class WebService {

  constructor(public globalVars: GlobalVars, public auth: AuthService) {
    console.log('Hello Web Provider');
  }

  public openUrl() {
    let userId = '';
    if(this.auth.user !== null && this.auth.user !== undefined){
      userId = this.auth.user.id;
      // let device = Device.device;
      //if(device.platform.toLowerCase() === 'ios') {
      //  InAppBrowser.open('http://ask.manytutors.com/api/user/' + userId, '_blank', 'location=no');
      //}
      //else{
        new InAppBrowser('http://ask.manytutors.com/api/user/' + userId, '_blank', 'location=no');
      //}
    }

  }
}
