import { Component } from '@angular/core';
import { Nav, NavParams } from 'ionic-angular';

import { PhotoViewer } from 'ionic-native';

import { QuestionViewPage } from '../question-view/question-view';
import { AnswerFeedbackPage } from '../answer-feedback/answer-feedback';
import { StateService } from '../../providers/state';

/*
  Generated class for the Answer page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-answer',
  templateUrl: 'answer.html'
})
export class AnswerPage {

  question:any;
  answer:any;

  constructor(public navCtrl: Nav, public navParams: NavParams, public state: StateService) {
    this.answer = navParams.get("answer");
    this.question = navParams.get("question");
    this.state.setCurrentPage('student', 'AnswerPage', {question: this.question, answer: this.answer});
    /*this.answer = {
      full_image: 'https://ask.manytutors.com/ask-mt/answers/1472105461-123.jpg',
      description: 'This is the answer',
      formatted_created_at: '1 hour ago',
      user: {
        profile_pic: 'https://graph.facebook.com/10205855827849241/picture?width=200&height=200',
        name: 'Weichang Lai',
      },
    };*/

  }

  ionViewDidLoad() {
    console.log('Hello AnswerPage Page');
  }

  openQuestion() {
    this.navCtrl.push(QuestionViewPage, {question: this.question});
  }

  completeQuestion() {
    this.navCtrl.push(AnswerFeedbackPage, {question: this.question, answerId: this.answer.id});
  }

  viewImage() {
    PhotoViewer.show(this.answer.full_image, 'Answer Picture', {share: false});
  }
}