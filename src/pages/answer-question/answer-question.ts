import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ModalController, Platform, ViewController } from 'ionic-angular';

import { Camera, PhotoViewer } from 'ionic-native';

import { AnswerSubmittedPage } from '../answer-submitted/answer-submitted';

import { AnswerService } from '../../providers/answer';
import { AuthService } from '../../providers/auth';
import { SettingsModal } from '../../providers/settings-modal';
import { StateService } from '../../providers/state';

/*
  Generated class for the AnswerQuestion page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-answer-question',
  templateUrl: 'answer-question.html'
})
export class AnswerQuestionPage {

  loader:any;
  answer = {share_facebook: false, description: '', image: undefined};
  question: any;
  user: any;
  facebookEnable = false;
  submitting = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public settingsModal : SettingsModal, public alertCtrl: AlertController, 
    public ansService: AnswerService, public auth: AuthService, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public state: StateService) {
    
    this.question = navParams.get("question");
    this.user = this.auth.getLoggedInUser();

    if(this.user && this.user.facebook_profile) {
      this.facebookEnable = true;
      this.answer.share_facebook = true;
    }
    this.state.setCurrentPage('tutor', 'AnswerQuestionPage', {question: this.question});
    this.takepic();
  }

  ionViewDidLoad() {
    console.log('Hello AnswerQuestionPage Page');
  }

  viewImage() {
    PhotoViewer.show(this.answer.image, 'Answer Picture', {share:false});
  }

  takepic() {
    let options = {
      quality: 80,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1520,
      targetHeight: 2688,
      saveToPhotoAlbum: false
    };
    Camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.answer.image = imageData;
    }, (err) => {
      // Handle error
	    console.log('error while taking picture', err);
    });
  }

  isAnswerValid() {
    let valid = false;
    if(this.answer.image && this.answer.description){
      valid = true;
    }
    return valid;
  }

  clearImage(){
    let confirm = this.alertCtrl.create({
      message: 'Do you want to delete this photo?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            console.log('Agree clicked');
            this.answer.image = undefined;
          }
        },
        {
          text: 'No',
          handler: () => {
            console.log('No');
          }
        }
      ]
    });
    confirm.present();
  }

  submitAnswer(){
    this.submitting = true;
    /*this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000,
      dismissOnPageChange: true
    });
    this.loader.present();*/
    //this.navCtrl.push(AnswerSubmittedPage, {question: this.question});
    this.ansService.submitAnswer(this.question.id, this.answer).then((data) => {
        console.log('Answer saved: ', data);
        this.navCtrl.setRoot(AnswerSubmittedPage, {question: this.question});
    }, (err) => {
        this.submitting = false;
        console.log('file transfer failure: ', err);
        alert("Error occurred while submitting answer, please try again...");
     })
  }

  openDescription(){
    let modal = this.modalCtrl.create(ModalsContentPage, {description:this.answer.description});
    modal.onDidDismiss(data => {
      this.answer.description = data;
    });
    modal.present();
  }

  settings(){
    this.settingsModal.settings('tutor');
  }

}

@Component({
  templateUrl: 'modal.html'
})
class ModalsContentPage {
  description:string;

  result:any;

  constructor(public platform: Platform, public params: NavParams, public viewCtrl: ViewController) {
    this.description = this.params.get('description');
  }

  assignDescription(){
    this.result = this.description;
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss(this.result);
  }
}