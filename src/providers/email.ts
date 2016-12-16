import { Injectable } from '@angular/core';
import { EmailComposer, Device } from 'ionic-native';

import { Events } from 'ionic-angular';

import { AuthService } from './auth';
import { GlobalVars } from './global-vars';

/*
  Generated class for the Email provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class EmailService {

  constructor(public globalVars: GlobalVars, public auth: AuthService, public events: Events) {
    console.log('Hello Email Provider');
  }

  public composeEmail() {
    let name = '';
    let device = Device.device;
    let body = 'Feedback:\n\n\n\n\n\n\n\n';
    let feedback = {subject: 'Help Needed/Feedback', content: 'Feedback:\n\n\n', name:'', email:''};
    if(this.auth.user !== null && this.auth.user !== undefined){
      name = this.auth.user.name + '/' + this.auth.user.id;
      feedback.name = this.auth.user.name;
      feedback.email = this.auth.user.email;
      feedback.content += 'Login Username/ID: ' + name + '\n';
      body += 'Login Username/ID: ' + name + '\n';
    }

    let info = 'Device Model: ' + device.model + '\n';
    info += 'Device System: ' + device.platform + ' ' + device.version + '\n';
    info += 'App Version: ' + this.globalVars.appVersion + '\n';
    info += 'Country/Language: ' + navigator.language + '\n';
    info += 'Push Notification: ' + 'enabled';
    let nativeEmailClient = true;
    EmailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
        //Now we know we can send
      }
    }).catch((error) => {
      nativeEmailClient = false;
      feedback.content += info;

      this.events.publish('nav:feedback', feedback);
      console.log('EmailComposer.isAvailable error', error);
    });
    body += info;
    let email = {
      to: 'enquiry@manytutors.com',
      subject: 'Help Needed/Feedback',
      body: body,
      isHtml: false
    };
    // Send a text message using default options
    EmailComposer.open(email);
  }

}
