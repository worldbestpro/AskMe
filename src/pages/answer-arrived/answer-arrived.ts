import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AnswerPage } from '../answer/answer';
import { QuestionViewPage } from '../question-view/question-view';
import { QuestionService } from '../../providers/question';
import { AnswerService } from '../../providers/answer';
import { StateService } from '../../providers/state';

/*
  Generated class for the AnswerArrived page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-answer-arrived',
  templateUrl: 'answer-arrived.html'
})
export class AnswerArrivedPage {

  questionId:number;
  question: any;
  answer: any;
  /*answer = {description:"Answer text", formatted_created_at:"22 seconds ago", full_image:"https://ask.manytutors.com/ask-mt/questions/1471510725-122.jpg", full_thumbnail:"https://ask.manytutors.com/ask-mt/answers/",
    user: {email:"mobdev2016@yandex.com",name:"Mobile Developer",profile_pic:"https://graph.facebook.com/100007669236107/picture?width=200&height=200"}
  }*/

  constructor(public navCtrl: NavController, public navParams: NavParams, public quesService: QuestionService, 
    public ansService: AnswerService, public state: StateService) {
      
    this.questionId = navParams.get("questionId");
    this.state.setCurrentPage('student', 'AnswerArrivedPage', {questionId: this.questionId});
    // this.answer = {
    // 	user: {
    // 		profile_pic: 'https://ask.manytutors.com/profile-pictures/1459320352-41502.jpg',
    // 		name: 'Jessica Tay',
    // 	}
    // }
  }

  ionViewDidLoad() {
    console.log('Hello AnswerArrivedPage Page');
  }

  onPageWillEnter() {
    console.log('answer recieved ', this.questionId);
    this.ansService.getAnswer(this.questionId).subscribe(
      res => {
        console.log(res);
        this.answer = res.data;
      },
      err => {
        console.warn('error from question status', err);
      });
    this.quesService.getQuestion(this.questionId).subscribe(
      res => {
        console.log(res);
        this.question = res.data.question;
      },
      err => {
        console.warn('error from question status', err);
      });
  }

  openAnswer(){
    this.navCtrl.setRoot(AnswerPage, {answer: this.answer, question: this.question});
  }

  openQuestion(){
    this.navCtrl.push(QuestionViewPage, {question: this.question});
  }

}
