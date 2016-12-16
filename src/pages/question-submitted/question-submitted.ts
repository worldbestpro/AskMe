import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { NativeAudio } from 'ionic-native';
import { Storage } from '@ionic/storage';

import { AnswerArrivedPage } from '../answer-arrived/answer-arrived';
import { SnapQuestionPage } from '../snap-question/snap-question';
import { QuestionService } from '../../providers/question';
import { AuthService } from '../../providers/auth';
import { SettingsModal } from '../../providers/settings-modal';
import { StateService } from '../../providers/state';

/*
  Generated class for the QuestionSubmitted page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-question-submitted',
  templateUrl: 'question-submitted.html'
})
export class QuestionSubmittedPage {

  question: any;
  refreshIntervalId: any;
  user: any;
  storage = new Storage();

  constructor(public navCtrl: NavController, public navParams: NavParams, public quesService: QuestionService, public alertCtrl: AlertController,  
    public settingsModal: SettingsModal, public auth: AuthService, public state: StateService) {
    
    this.question = navParams.get("question");
    this.user = this.auth.getLoggedInUser();
    //this.storage.set('question', JSON.stringify(this.question));
    this.state.setCurrentPage('student', 'QuestionSubmittedPage', {question: this.question});
  }

  ionViewDidLoad() {
    console.log('Hello QuestionSubmittedPage Page');
  }

  onPageWillEnter() {

    this.refreshIntervalId = setInterval(function() {
    	this.checkQuestionAnswer()	
    }.bind(this), 10000);

    this.checkQuestionAnswer();
  }

	checkQuestionAnswer() {
		this.quesService.questionStatus(this.question.id).subscribe(
			res => {
				console.log(res.result);
				if (res.result === 'answered') {
					clearInterval(this.refreshIntervalId);
					this.storage.remove('question');
					NativeAudio.play('answer-received', function (success) {
						console.log(success);
					});
					this.navCtrl.setRoot(AnswerArrivedPage, {questionId:this.question.id});
				}
			},
			err => {
  	    		console.warn('error from question status', err);
		});
	}

  cancelQuestion() {
    let confirm = this.alertCtrl.create({
      message: 'You should only cancel if you want to ask another question or you submitted wrongly. <br><br>You can exit the app while waiting for an answer.<br><br>You will not get an answer to this question. Do you still want to cancel?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            console.log('Agree clicked');
            this.quesService.cancelQuestion(this.question.id, this.user.id).subscribe(
                res => {
                console.log(res);
                clearInterval(this.refreshIntervalId);
                this.storage.remove('question');
                this.navCtrl.setRoot(SnapQuestionPage)
              },
                err => {
                console.warn('error from question status', err);
              });
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


  settings() {
    this.settingsModal.settings('student');
  }
}