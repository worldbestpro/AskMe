import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PhotoViewer } from 'ionic-native';

import { AnswerQuestionPage } from '../answer-question/answer-question';
import { AuthService } from '../../providers/auth';
import { StateService } from '../../providers/state';

/*
  Generated class for the QuestionView page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-question-view',
  templateUrl: 'question-view.html'
})
export class QuestionViewPage {

  question: any;
  role: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthService, public state: StateService) {
    this.question = navParams.get("question");
    this.role = this.auth.getUserRole();
    if (this.role === 'tutor') {
      this.state.setCurrentPage(this.role, 'QuestionViewPage', {question: this.question});
    }

    /*this.question = {
      full_image: 'https://ask.manytutors.com/ask-mt/questions/1472103729-154.jpg',
      formatted_created_at: '10 hours ago',
      description: 'When is Cheryl\'s birthday?',
      tags: [
        {label: 'Primary 1'},
        {label: 'Primary 2'},
      ],
      author: {
        profile_pic: 'https://ask.manytutors.com/assets/img/student-avatar.jpg',
        name: 'Cheryl',
      },
    };
    this.role = 'tutor';*/
  }

  ionViewDidLoad() {
    console.log('Hello QuestionViewPage Page');
  }

  answerQuestion() {
    this.navCtrl.setRoot(AnswerQuestionPage, {question: this.question});
  }

  viewImage() {
    PhotoViewer.show(this.question.full_image, 'Question Picture', {share:false});
  }
}