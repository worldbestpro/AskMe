import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Platform, ViewController } from 'ionic-angular';

import { SnapQuestionPage } from '../snap-question/snap-question';
import { AnswerService } from '../../providers/answer';

/*
  Generated class for the AnswerFeedback2 page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-answer-feedback-2',
  templateUrl: 'answer-feedback-2.html'
})
export class AnswerFeedbackNextPage {

  loader:any;
  answerId:any;
  question:any;
  answerVote = {type:undefined, comment:''};

  constructor(public navCtrl: NavController, public navParams: NavParams, public ansService: AnswerService, public modalCtrl: ModalController) {
    this.answerId = navParams.get("answerId");
    this.answerVote.type = navParams.get("type");
	  this.question = navParams.get("question");
    /*this.stateService.setCurrentPage('student', 'AnswerFeedbackPage');
    this.stateService.setParameters('student', {answerId: this.answerId});*/
  }

  ionViewDidLoad() {
    console.log('Hello AnswerFeedback2Page Page');
  }

  isDataValid() {
    return this.answerVote.type ? true: false;
  }

  voteAnswer(){
    this.ansService.voteAnswer(this.answerId, this.answerVote).subscribe(
      res => {
        console.log(res);
        this.navCtrl.setRoot(SnapQuestionPage, {question: this.question, revisit:true});
      },
      err => {
        console.warn('error from vote answer', err);
    });
  }

  openComment(){
    let modal = this.modalCtrl.create(ModalsContentPage, {comment:this.answerVote.comment});
    modal.onDidDismiss(data => {
      this.answerVote.comment = data;
    });
    modal.present();
  }
}

@Component({
  templateUrl: 'modal.html'
})
class ModalsContentPage {
  comment:string;
  result:any;

  constructor(public platform: Platform, public params: NavParams, public viewCtrl: ViewController) {
    this.comment = this.params.get('comment');
  }

  assignComment(){
    this.result = this.comment;
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss(this.result);
  }
}