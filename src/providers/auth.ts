import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Device } from 'ionic-native';
import { Storage } from '@ionic/storage';

import { GlobalVars } from './global-vars';

/*
  Generated class for the Auth provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {

  user: any;
  role: string;
  deviceToken: string;
  storage = new Storage();

  constructor(public http: Http, public globalVars: GlobalVars) {
    console.log('Hello Auth Provider');

    this.storage.get('user').then((data) => {
      if (data != null) {
        this.user = JSON.parse(data);
      }
    });
    this.storage.get('role').then((data) => {
      if (data != null) {
        this.role = data;
      }
    });
    this.storage.get('deviceToken').then((data) => {
      if (data != null) {
        this.deviceToken = data;
      }
    });
  }

  public getLoggedInUser(){
    return this.user;
  }

  public getUserAccessToken(){
    return this.user ? this.user.access_token : '';
  }

  public getUserRole(){
    return this.role;
  }

  public getDeviceToken(){
    return this.deviceToken;
  }

	/**
	 * Get Device Type
	 */
	public getDeviceType() {
		let deviceType = 'android';
    try {
      let device = Device.device;
      deviceType = device.platform.toLowerCase();
    } catch (err) { 
      console.log(err);
      deviceType='android';
    }

		return deviceType;
	}

  	/**
  	 * Create Email
  	 * @param {any} user User Data
  	 */
	public createEmail(user:any) {
		var url = this.globalVars.getApiUrlPrefix()+'user/email';
		user.device_token = this.deviceToken;
		user.device_type = this.getDeviceType();

		var response = this.http.post(url, user).map(res => res.json());

		return response;
	}

	/**
	 * Login with email
	 * @param {any} user [description]
	 */
	public emailLogin(user:any) {
		var url = this.globalVars.getApiUrlPrefix()+'user/email/login';
		user.device_token = this.deviceToken;
		user.device_type = this.getDeviceType();
		var response = this.http.post(url, user).map(res => res.json());

		return response;
	}

  public socialLogin(fbUser:any) {
	  var url = this.globalVars.getApiUrlPrefix()+'user/';
	  fbUser.device_token = this.deviceToken;

    try {
		  let device = Device.device;
		  fbUser.device_type = device.platform.toLowerCase();
    } catch (err) { 
    	console.log(err);
    	fbUser.device_type='android';
	  }
    //console.log(JSON.stringify(fbUser));
    var response = this.http.post(url, fbUser).map(res => res.json());
    return response;
  }

  public logout() {
    this.user = null;
    this.role = null;
    this.storage.remove('role');
    return this.storage.remove('user');
  }

  public updateFacebookShare(canShare :boolean) {
  	console.log("Updating Facebook Share");
  	this.user.fb_share = canShare;
  	this.storage.set('user', JSON.stringify(this.user));

  	return this.updateFacebookShareInDB(canShare);
  }

  public updateFacebookShareInDB(canShare :boolean) {
  	console.log("Update Facebook Share in DB");
    var url = this.globalVars.getApiUrlPrefix()+'user/fb_share';
    let payload = {
      access_token: this.user.access_token,
      fb_share: canShare,
    };
    
 	  return this.http.post(url, payload).map(res => res.json());
  }

  public storeLoggedInUser(user:any) {
    this.user = user;
    return this.storage.set('user', JSON.stringify(user));
  }

  public setUserRole(role: string) {
    this.role = role;
    return this.storage.set('role', role);
  }

  public setDeviceToken(deviceToken:string){
    this.deviceToken = deviceToken;
    return this.storage.set('deviceToken', deviceToken);
  }

  public getRolePromise(){
    return this.storage.get('role');
  }

  public getUserPromise(){
    return this.storage.get('user');
  }

  public getDeviceTokenPromise(){
    return this.storage.get('deviceToken');
  }

  public submitFeedback(feedback:any) {
    let url = this.globalVars.getApiUrlPrefix()+'enquiry';

    return this.http.post(url, feedback).map(res => res.json());
  }

  public hasFacebookShare() {
  	return (this.user.fb_share) ? true : false;
  }
}
