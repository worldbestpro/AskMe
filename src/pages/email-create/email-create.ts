import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';

import { AuthService } from '../../providers/auth';
import { StateService } from '../../providers/state';

/*
  Generated class for the EmailCreate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-email-create',
  templateUrl: 'email-create.html'
})
export class EmailCreatePage {

  loader:any;
	name:string;
	email:string;
	password:string;
  
  constructor(public navCtrl: NavController, public auth: AuthService, public loadingCtrl: LoadingController, 
    public state: StateService, public alertCtrl: AlertController) {
		console.log("I'm at Email Create Page");
	}

  ionViewDidLoad() {
    console.log('Hello EmailCreatePage Page');
  }

  createEmail() {

		this.loader = this.loadingCtrl.create({
		  content: "Loading...",
		  duration: 3000,
		  dismissOnPageChange: true
		});
		this.loader.present();

		console.log("Email is created");

		let user = {
		  name: this.name,
		  email: this.email,
		  password: this.password,
		};

		// console.log(user);
        this.auth.createEmail(user)
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
		let message = err.json().error.message;
		let messageString = message.join('<br>'); 
		this.errorDialog(messageString);
	}

	errorDialog(message :string) {
		let alert = this.alertCtrl.create({
      title: 'Error.',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
	}
}