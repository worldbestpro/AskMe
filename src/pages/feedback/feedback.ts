import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { AuthService } from '../../providers/auth';
import { StateService } from '../../providers/state';

/*
  Generated class for the Feedback page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html'
})
export class FeedbackPage {

  feedback:any;
  submitting = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, 
    public auth: AuthService, public state: StateService) {
    
    this.feedback = navParams.get("feedback");
    if(this.feedback === undefined || this.feedback === null) {
      this.feedback = {};
    }
  }

  ionViewDidLoad() {
    console.log('Hello FeedbackPage Page');
  }

  isFeedbackValid(){
    let valid = false;
    if(this.validateEmail(this.feedback.email) && this.feedback.name && this.feedback.subject && this.feedback.content){
      valid = true;
    }
    return valid;
  }

  validateEmail(email){
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return reg.test(email) ? true : false;
  }

  submitFeedback(){
    this.submitting = true;
    this.auth.submitFeedback(this.feedback).subscribe(
      res => {
        console.log('Feedback saved: ', res);
        let alert = this.alertCtrl.create({
          subTitle: 'Email has been sent',
          buttons: ['OK']
        });
        alert.present();
        this.submitting = false;
        this.state.navigateToAppropriatePage();
      },
        err => {
          console.log('file transfer failure: ', err);
          this.submitting = false;
          alert("Error occurred while submitting feedback, please try again...");
      });
  }
}