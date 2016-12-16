import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SocialSharing } from 'ionic-native';

import { QuestionPage } from '../question/question';
import { SettingsModal } from '../../providers/settings-modal';
import { StateService } from '../../providers/state';

/*
  Generated class for the SnapQuestion page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-snap-question',
  templateUrl: 'snap-question.html'
})
export class SnapQuestionPage {

  revisit = false;
  question:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public settingsModal: SettingsModal, public state: StateService) {
    
    this.revisit = navParams.get("revisit");
    this.state.setCurrentPage('student', 'SnapQuestionPage', null);

    if (this.revisit)
      this.question = navParams.get("question");

  }

  ionViewDidLoad() {
    console.log('Hello SnapQuestionPage Page');
  }

  askQuestion() {
    this.navCtrl.setRoot(QuestionPage);
  }

  settings(){
    this.settingsModal.settings('student');
  }

  shareQuestion() {
  	// this is the complete list of currently supported params you can pass to the plugin (all optional)
  	let options = {
  	  message: "Hey, I've just got an answer to this question. You can ask a question here too!", // not supported on some apps (Facebook, Instagram)
  	  subject: "I've just got an answer to this question", // fi. for email
  	  url: this.question.full_url,
  	  chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
  	}

  	SocialSharing.shareWithOptions(options);
  }
}