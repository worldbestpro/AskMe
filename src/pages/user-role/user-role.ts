import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { SettingsPage } from '../../pages/settings/settings';
import { SnapQuestionPage } from '../../pages/snap-question/snap-question';
import { ScanQuestionPage } from '../../pages/scan-question/scan-question';
import { QuestionSubmittedPage } from '../../pages/question-submitted/question-submitted';
import { AuthService } from '../../providers/auth';

/*
  Generated class for the UserRole page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-role',
  templateUrl: 'user-role.html'
})
export class UserRolePage {

  loader:any;
  role:string;
  storage = new Storage();

  constructor(public navCtrl: NavController, public auth: AuthService, public loadingCtrl: LoadingController) {
  	// Why do you need a loader here???
    // this.loader = this.loadingCtrl.create({
    //   content: "Please wait...",
    //   duration: 3000,
    //   dismissOnPageChange: true
    // });
    // this.loader.present();
    //this.checkLogin();
  }

  ionViewDidLoad() {
    console.log('Hello UserRolePage Page');
  }

  checkLogin() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000,
      dismissOnPageChange: true
    });
    this.loader.present();
    this.auth.getRolePromise().then(res => {
      if (res != null) {
        console.log('res  ', res);
        if (res === 'student') {
          this.auth.getUserPromise().then(usr => {
            if (usr !== undefined) {
              this.storage.get('question').then((data) => {
                if (data !== undefined) {
                  console.log(data);
                  let question = JSON.parse(data);
                  this.navCtrl.setRoot(QuestionSubmittedPage, {question: question});
                }
                else {
                  this.navCtrl.setRoot(SnapQuestionPage);
                }
              });
            }
          })
        }
        else {
          this.navCtrl.setRoot(ScanQuestionPage);
        }
      }

    });

  }

  changeRole(role:string) {
    this.role = role;
    this.auth.setUserRole(role).then(
        res => {
        if (this.role === 'student') {
          this.navCtrl.push(SettingsPage);
        } else {
          this.navCtrl.setRoot(ScanQuestionPage);
        }
      },
        err => {
        console.log('error while storing role locally', err);
      }
    )
  }
}