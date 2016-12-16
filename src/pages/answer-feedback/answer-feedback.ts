import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SnapQuestionPage } from '../snap-question/snap-question';
import { AnswerFeedbackNextPage } from '../answer-feedback-2/answer-feedback-2';
import { AnswerService } from '../../providers/answer';

/*
  Generated class for the AnswerFeedback page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-answer-feedback',
  templateUrl: 'answer-feedback.html'
})
export class AnswerFeedbackPage {

  answerId:any;
  question:any;
  answerVote = {type:undefined, comment:''};

  constructor(public navCtrl: NavController, public navParams: NavParams, public ansService: AnswerService) {
    this.answerId = navParams.get("answerId");
    this.question = navParams.get("question");
    /*this.stateService.setCurrentPage('student', 'AnswerFeedbackPage');
    this.stateService.setParameters('student', {answerId: this.answerId});*/
  }

  ionViewDidLoad() {
    console.log('Hello AnswerFeedbackPage Page');
  }

  next(type:string){
    this.navCtrl.push(AnswerFeedbackNextPage, {question: this.question, type:type, answerId: this.answerId});
  }

  isDataValid(){
    return this.answerVote.type ? true: false;
  }

  voteAnswer(){
    this.ansService.voteAnswer(this.answerId, this.answerVote).subscribe(
      res => {
        console.log(res);
        this.navCtrl.setRoot(SnapQuestionPage, {revisit:true, question: this.question});
      },
      err => {
        console.warn('error from vote answer', err);
    });
  }

}