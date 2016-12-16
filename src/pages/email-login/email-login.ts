import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';

import { EmailCreatePage } from '../email-create/email-create';
import { AuthService } from '../../providers/auth';
import { StateService } from '../../providers/state';

/*
  Generated class for the EmailLogin page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-email-login',
  templateUrl: 'email-login.html'
})
export class EmailLoginPage {

  loader:any;
	email:string;
	password:string;

	constructor(public navCtrl: NavController, public auth: AuthService, public loadingCtrl: LoadingController, 
    public state: StateService, public alertCtrl: AlertController) {
		
    console.log("I'm at Email Login Page");
	}

  ionViewDidLoad() {
    console.log('Hello EmailLoginPage Page');
  }

  loginEmail() {
		this.loader = this.loadingCtrl.create({
		  content: "Loading...",
		  duration: 3000,
		  dismissOnPageChange: true
		});
		this.loader.present();

		let user = {
			email: this.email,
			password: this.password,
		};

    this.auth.emailLogin(user)
      .subscribe(this.handleSuccess.bind(this), this.handleError.bind(this));
	}

	handleSuccess(res :any) {
		this.auth.storeLoggedInUser(res.data).then(
			res => {
				console.log(res);
				this.state.navigateToAppropriatePage();
		});
	}
	
	handleError(err :any) {
		this.loader.dismiss();    
		this.errorDialog(err.json().error.message.join('<br>'));
	}

	errorDialog(message :string) {
		let alert = this.alertCtrl.create({
      title: 'Error.',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
	}

	createEmail() {
	  this.navCtrl.push(EmailCreatePage);
	}
}