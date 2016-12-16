import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { BarcodeScanner } from 'ionic-native';

import { QuestionViewPage } from '../question-view/question-view';
import { AuthService } from '../../providers/auth';
import { QuestionService } from '../../providers/question';
import { SettingsModal } from '../../providers/settings-modal';
import { StateService } from '../../providers/state';

/*
  Generated class for the ScanQuestion page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-scan-question',
  templateUrl: 'scan-question.html'
})
export class ScanQuestionPage {

  loader:any;
  question:any;
  user:any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public auth: AuthService, 
    public quesService: QuestionService, public settingsModal: SettingsModal, public state: StateService) {
    
    this.user = this.auth.getLoggedInUser();
    this.state.setCurrentPage('tutor', 'ScanQuestionPage', null);
  }

  ionViewDidLoad() {
    console.log('Hello ScanQuestionPage Page');
  }

  scan(){
    //this.loadQuestion('http://localhost:8100/api/question/99/user/9');
    BarcodeScanner.scan().then((barcodeData) => {
      console.log('barcodeData',barcodeData);
      this.loadQuestion(barcodeData.text);
    }, (err) => {
      // An error occurred
      console.error(err);
    });
  }

  loadQuestion(url:string) {
    /*this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000,
      dismissOnPageChange: true
    });
    this.loader.present();*/
    this.quesService.scannedQuestion(url).subscribe (
      res => {
        this.question = res.data.question;
        this.auth.setUserRole('tutor');
        this.user = res.data.user;
        this.auth.storeLoggedInUser(this.user);
        this.navCtrl.push(QuestionViewPage, {question: this.question});
      },
      err => {
        console.warn('error from question status', err);
    });
  }

  settings(){
    this.settingsModal.settings('tutor');
  }

}