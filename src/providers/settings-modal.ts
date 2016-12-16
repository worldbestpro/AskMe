import { Injectable } from '@angular/core';

import { Events, ActionSheetController } from 'ionic-angular';

import { AuthService } from '../providers/auth';
import { StateService } from '../providers/state';
import { EmailService } from '../providers/email';
import { WebService } from '../providers/web';


/*
  Generated class for the SettingsModal provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SettingsModal {

  user: string;
  role: string;
  constructor(public actionSheetCtrl: ActionSheetController, public auth: AuthService, public emailService: EmailService,
    public web: WebService, public state: StateService, public events: Events) {
    
    this.auth.getUserPromise().then(res => {
      this.user = res;
    });
    this.auth.getRolePromise().then(res => {
      this.role = res;
    });
  }

  switchRole(role: string){
		console.log("logout");
		this.auth.logout();
		this.user = undefined;
		this.auth.setUserRole(role).then(res => {
			this.role = role;
			this.state.navigateToAppropriatePage();
		});
		return;
	}

  settings(role: string) {
    this.user = this.auth.user;
    this.role = this.auth.role;
    if(role === 'student') {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Settings',
        buttons: [
          {
            text: 'Switch to Tutor',
            role: 'destructive',
            handler: () => {
              this.switchRole('tutor');
              //this.auth.setUserRole('tutor');
              //this.navCtrl.setRoot(ScanQuestionPage);
            }
          }, {
            text: 'Your Question History',
            handler: () => {
              this.web.openUrl();
            }
          }, {
            text: 'Log out',
            handler: () => {
              this.auth.logout();
              this.user = undefined;

              this.events.publish('root:user-role');
            }
          }, {
            text: 'Report an issue',
            handler: () => {
              this.emailService.composeEmail();
            }
          }, {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }
    else{
        let actionSheet = this.actionSheetCtrl.create({
          title: 'Settings',
          buttons: [
            {
              text: 'Switch to Student',
              role: 'destructive',
              handler: () => {
                this.switchRole('student');
                /*this.auth.setUserRole('student');
                if(this.user !== undefined && this.user !== null) {
                  this.navCtrl.setRoot(SnapQuestionPage);
                }
                else{
                  this.navCtrl.push(SettingsPage);
                }*/
              }
            },{
              text: 'Report an issue',
              handler: () => {
                this.emailService.composeEmail();
              }
            },{
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]
        });
        actionSheet.present();
    }
  }
}