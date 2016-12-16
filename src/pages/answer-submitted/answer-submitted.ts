import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ScanQuestionPage } from '../scan-question/scan-question';
import { StateService } from '../../providers/state';

/*
  Generated class for the AnswerSubmitted page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-answer-submitted',
  templateUrl: 'answer-submitted.html'
})
export class AnswerSubmittedPage {

  question:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public state: StateService) {
    this.question = navParams.get("question");
    this.state.setCurrentPage('tutor', 'AnswerSubmittedPage', {question: this.question});
    /*this.question = {
     	author: {
     		name: 'Jason Txf',
     	}
    };*/
  }

  ionViewDidLoad() {
    console.log('Hello AnswerSubmittedPage Page');
  }

  cancelButton(){
    console.log('cancel button clicked');
  }

  solveAnotherQuestion(){
    this.navCtrl.setRoot(ScanQuestionPage);
  }
}