import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { Facebook, SocialSharing } from 'ionic-native';
import { EmailLoginPage } from '../../pages/email-login/email-login';

import { AuthService } from '../../providers/auth';
import { StateService } from '../../providers/state';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  loader:any;
  role: string;
  response:any;
  previousFBPromiseIsActive: any;

  constructor(public navCtrl: NavController, public auth: AuthService, public loadingCtrl: LoadingController, public state: StateService) {
    this.role = this.auth.getUserRole();
  }

  ionViewDidLoad() {
    console.log('Hello SettingsPage Page');
  }

  login(){

    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000,
      dismissOnPageChange: true
    });
    this.loader.present();

    if (!this.auth.getLoggedInUser()) {
      let fbUser =
      {"name":"Barkat Dhillon","fb_access_token":"EAALiUAE0m9sBAAxTjBAbBRicqPgntaBNhcHeZAjf5Utkb39TqZACIBrYlENnoQAQxdMectej2ZCBk159cZCZCIZClahfesZAkt5UvEK4PpQ8TMGMSA2KVF7FE0DR0yZCa0KEE0v4gSZA5wf1JeTMgeNzVkjQfF8KhUQHG8jqD5CmPgCciEth4VrBk2t3YtztxWOjHJr4NuXOK4Cijb9wHlzRx","fb_uid":"10154405544727943","email":"barkatdhillon@gmail.com","device_token":"fqsq2ucl00I:APA91bFJMoI_7tlfUAlffqjMoKpwnGOSO4pkhHWVFLf87UJ-petyQWWpk8cDydjryb_w0W_dN-LBycEc-p4MujiecLV-3BLqYKJRtdXGth9I2FGGpXUhpxDtxywIshhyXacXyUHpmFGV","device_type":"android"}
      this.auth.socialLogin(fbUser).subscribe(
        res => {
          this.auth.storeLoggedInUser(res.data).then(
            res => {
              this.state.navigateToAppropriatePage();
            },
            err => {
              console.log('error while storing user locally', err);
            }
          )
        },
        err => {
          console.warn('error from ask.com', err);
        }
      );
    }
    else {
      this.state.navigateToAppropriatePage();
    }
  }

  emailLogin() {
    this.navCtrl.push(EmailLoginPage);
  }

  // private navigate(){
  //   if (this.auth.getUserRole() === 'student') {
  //     this.navCtrl.setRoot(SnapQuestionPage);
  //   }
  //   else {
  //     this.navCtrl.setRoot(ScanQuestionPage);
  //   }
  // }

  	/**
  	 * TAKE NOTE OF WEIRD BEHAVIOR
  	 * This is an issue that I have no idea how to fix.
  	 * Please fix it if anyone knows how.
  	 *
  	 * 2 issues identified ONLY IN ANDROID
  	 * 
  	 * ISSUE ONE:
  	 * When user login to facebook for the first time,
  	 * when ask for publish_actions permission, if user click "Not Now"
  	 * for android, error promises IS NOT CALLED.
  	 * As a result, app will hang.
  	 * As a work around, as long as user login to MT, we will just redirect
  	 * to SnapQuestionPage.
  	 *
  	 * ISSUE TWO:
  	 * If user click on "Not Now" and landed at "SnapQuestionPage"
  	 * IF they logout immediately, then when they try to relogin, 
  	 * loginToFacebook() is called. BUT because previous 
  	 * promise for listening to publish_actions is still active,
  	 * Facebook.login() promise will not be activated but activate 
  	 * the previous promises.
  	 *
  	 * The workaround solution is that when the active promises was called
  	 * simply check if previousFBPromiseIsActive in localStorage is true. if FALSE, that means
  	 * it should not proceed but instead redirect back to this.loginWithFacebook2()
  	 * This way, user will be able to go through the entire flow to login again.
  	 */
	loginWithFacebook2() {
		console.log("Trigger Login with facebook 2");
	    Facebook.browserInit(811783198907355);

		window.localStorage.setItem('nextStepFBPromisesIsActive', 'false');

		Facebook.login(['public_profile','email','user_birthday', 'user_education_history', 'user_work_history']).then((response) => {
			console.log("Logging you in LOL");
			this.displayLoader();
			this.response = response; 

			setTimeout(function(){
				this.proceedWithFBLogin(response);
			}.bind(this), 500);

		}, (err) => {
			console.log("Is there such a thing?");
		});
	}

	proceedWithFBLogin(response) {
		Facebook.api('/'+this.response.authResponse.userID+'?fields=id,email,first_name,last_name,birthday,education,work', []).then((info) => {
			console.log("Success in getting user graph");
			let user = this.parseFBUser(response, info);
			this.loginMT(user);
		});
	}

	loginMT(user) {
		console.log("Logging into ManyTutors");
		this.auth.socialLogin(user).subscribe( (res) => {
			console.log(res.data);
	        this.auth.storeLoggedInUser(res.data).then(
	        	(res) => {
					this.proceedWithNextStep();
	        	}
	    	);
		});

	}

	displayLoader() {
		this.loader = this.loadingCtrl.create({
		  content: "Please wait...",
		  duration: 3000,
		  dismissOnPageChange: true
		});
		this.loader.present();
	}

	proceedWithNextStep() {
		console.log("Proceeding with getting permission");
		this.displayLoader();
		window.localStorage.setItem('nextStepFBPromisesIsActive', 'true');

		Facebook.api('/'+this.response.authResponse.userID+'?fields=id', ['publish_actions']).then(
			(info) => {			
				console.log('Able to get publish permission perfect!');

				let nextStepFBPromisesIsActive = window.localStorage.getItem('nextStepFBPromisesIsActive');
				console.log("Last Step Value: " +nextStepFBPromisesIsActive);

				if (nextStepFBPromisesIsActive === 'false') {
					console.log("User come from loginToFacebook(). Redirecting back there...");
					this.loginWithFacebook2();
					return;
				}

				console.log("Proceed to update permission");
				this.auth.updateFacebookShare(true).subscribe(() => {
		        this.state.navigateToAppropriatePage();
				});
			}, 
			(err) => {
				console.log('Unable to get permission. But nvm proceed');
	      this.state.navigateToAppropriatePage();
		});
		console.log("End of Next Step");

        this.state.navigateToAppropriatePage();
	}

	parseFBUser(response, info) {
		let fbUser = {
			name: info.first_name+' '+info.last_name,
			fb_access_token: response.authResponse.accessToken,
			fb_uid: info.id,
			fb_share: false,
			email: info.email,
			birthday: info.birthday,
			education: info.education,
			work: info.work,
			device_token: 123
		}

		return fbUser;
	}

  /**
   * Deprecate Code. Not in use anymore.
   * Refactored and adjusted logic. @loginWithFacebook2
   */
  loginWithFacebook() {
    Facebook.login(['public_profile','email','user_birthday', 'user_education_history', 'user_work_history']).then((response) => {
      this.response = response;
      //console.log('response',JSON.stringify(response));
      var that = this;
      setTimeout(function(){

        Facebook.api('/'+that.response.authResponse.userID+'?fields=id,email,first_name,last_name,birthday,education,work',['publish_actions']).then((info) => {

          console.log('info', JSON.stringify(info));

          that.loader = that.loadingCtrl.create({
            content: "Please wait...",
            duration: 3000,
            dismissOnPageChange: true
          });
          that.loader.present();
          
          let fbUser = {
            name: info.first_name+' '+info.last_name,
            fb_access_token: response.authResponse.accessToken,
            fb_uid: info.id,
            fb_share: false,
            email: info.email,
            birthday: info.birthday,
            education: info.education,
            work: info.work,
            device_token: 123
          }
          //console.log('fbUser',fbUser);
          that.auth.socialLogin(fbUser).subscribe(
              res => {
              //console.log(res);
                that.auth.storeLoggedInUser(res.data).then(
                  res => {
                    that.state.navigateToAppropriatePage();
                  //this.navigate();
                },
                  err => {
                  console.log('error while storing user locally', err);
                }
              )
            },
              err => {
              console.warn('error from ask.com', err);
            });


        }, (err) => {
          console.log('error', err);
        });

      }, 500);
      
    }, (err) => {
      // An error occurred
      console.error(err);
    });
  }

  changeRole(role:string){
    this.auth.setUserRole(role);
    this.role = role;
  }

  shareOnFacebook() {
    SocialSharing.shareViaFacebook('Hello this is message', 'http://ionicframework.com/dist/preview-app/www/img/nin-live.png', 'http://google.com').then((response) => {
      console.log('response',response);
    }, (err) => {
      // An error occurred
      console.error('error', err);
    });

  }
}