import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, AlertController, Platform, NavParams, ViewController } from 'ionic-angular';
import { Camera, PhotoViewer, NativeAudio } from 'ionic-native';

import { QuestionSubmittedPage } from '../question-submitted/question-submitted';
import { AuthService } from '../../providers/auth';
import { QuestionService } from '../../providers/question';
import { SettingsModal } from '../../providers/settings-modal';
import { StateService } from '../../providers/state';

import { Storage } from '@ionic/storage';

/*
  Generated class for the Question page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-question',
  templateUrl: 'question.html'
}) 
export class QuestionPage {

  levelSubjectList = new LevelSubjectList();
  loader:any;
  level:string;
  subject:string;
  submitting = false;
  storage = new Storage();
  hasFacebookShare :boolean;
  //https://ask.manytutors.com/ask-mt/questions/1470059110-34.jpg
  //https://ask.manytutors.com/ask-mt/questions/1471863245-139.jpg
  //http://placehold.it/100x100
  question = {share_facebook: false, description: '', image: undefined, tags:undefined};

  subjects = [];

  constructor(public navCtrl: NavController, public quesService: QuestionService, public loadingCtrl: LoadingController, public alertController: AlertController, 
    public settingsModal: SettingsModal, public modalCtrl: ModalController, public auth: AuthService, public state: StateService) {
    
    this.takepic();
    this.storage.get('level').then((data) => {
      if (data != null) {
        this.level = data;
        this.subjects = this.levelSubjectList.getRelatedSubjects(this.level);
      }
    });
    this.storage.get('subject').then((data) => {
      if (data != null) {
        this.subject = data;
      }
    });
    // this.state.setCurrentPage('student', 'QuestionPage');
    // this.state.setParameters('student', null);

    if (this.auth.hasFacebookShare()) {
    	this.hasFacebookShare = true;
    	this.question.share_facebook = true;
    }
  }

  ionViewDidLoad() {
    console.log('Hello QuestionPage Page');
  }

  viewImage() {
    PhotoViewer.show(this.question.image, 'Question Picture', {share:false});
  }

  clearImage() {
    let confirm = this.alertController.create({
      message: 'Do you want to delete this photo?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            console.log('Agree clicked');
            this.question.image = undefined;
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
      this.question.image = imageData;
    }, (err) => {
      // Handle error
      console.log('error while taking picture', err);
    });
  }

  isQuestionValid() {
    let valid = false;
    if(this.level && this.subject && this.question.image && this.question.description){
      valid = true;
    }
    return valid;
  }

  submitQuestion() {
    this.submitting = true;
    /* this.loader = this.loadingCtrl.create({
     content: "Please wait...",
     duration: 3000,
     dismissOnPageChange: true
     });
     this.loader.present();*/
    //this.navCtrl.push(QuestionSubmittedPage, {question: {id:51}});
    let tags = '';
    if (this.level !== undefined) {
      tags = tags + this.level;
    }
    if (this.subject !== undefined) {
      if (tags !== '') {
        tags = tags + ', ';
      }
      tags = tags + this.subject;
    }
    this.question.tags = tags;
    this.quesService.submitQuestion(this.question).then((data) => {
      console.log('Question saved: ', data);
      var questionInfo = JSON.parse(data.response).data;
      console.log(questionInfo);
      NativeAudio.play('question-sent', function (success) {
        console.log(success);
      });
      this.navCtrl.setRoot(QuestionSubmittedPage, {question: questionInfo});
    }, (err) => {
      console.log('file transfer failure: ', err);
      this.submitting = false;
      alert("Error occurred while submitting question, please try again...");
    })
  }

  openLevelList() {
    let modal = this.modalCtrl.create(ModalsContentPage, {type: 'level', level: this.level});
    modal.onDidDismiss(data => {
      this.level = data.level;
      this.subjects = data.subjects;
      if(this.subjects != null && this.subjects.length === 1){
        this.subject = this.subjects[0];
        this.storage.set('subject', this.subject);
      }
      else{
        this.subject = undefined;
      }
      this.storage.set('level', this.level);
    });
    modal.present();
  }

  openSubjectList() {
    let modal = this.modalCtrl.create(ModalsContentPage, {
      type: 'subject',
      subject: this.subject,
      subjects: this.subjects
    });
    modal.onDidDismiss(data => {
      this.subject = data;
      this.storage.set('subject', this.subject);
    });
    modal.present();
  }

  openDescription() {
    let modal = this.modalCtrl.create(ModalsContentPage, {type: 'description', description: this.question.description});
    modal.onDidDismiss(data => {
      this.question.description = data;
    });
    modal.present();
  }

  settings() {
    this.settingsModal.settings('student');
  }

}

@Component({
  templateUrl: 'modal.html'
})
class ModalsContentPage {
  levelSubjectList = new LevelSubjectList();

  subjects = [];

  type:string;
  level:string;
  subject:string;
  description:string;

  result:any;

  constructor(public platform:Platform, public params:NavParams, public viewCtrl:ViewController) {
    this.type = this.params.get('type');
    this.level = this.params.get('level');
    this.subject = this.params.get('subject');
    this.subjects = this.params.get('subjects');
    this.description = this.params.get('description');
  }

  assignLevel(level:string) {
    this.level = level;
    this.result = {level: this.level, subjects: []};
    this.result.subjects = this.levelSubjectList.getRelatedSubjects(this.level);
    this.dismiss();
  }

  public getSubjects(levels, level) {
    let subjects = [];
    for (var i = 0; i < levels.length; i++) {
      if (levels[i].name === level) {
        subjects = levels[i].subjects
        break;
      }
    }
    return subjects;
  }

  assignSubject(subject:string) {
    this.subject = subject;
    this.result = this.subject;
    this.dismiss();
  }

  assignDescription() {
    this.result = this.description;
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss(this.result);
  }


}


class LevelSubjectList {
  primaryLevels = [
    {name: 'Primary 1', subjects: ['Maths']},
    {name: 'Primary 2', subjects: ['Maths']},
    {name: 'Primary 3', subjects: ['Maths', 'Science']},
    {name: 'Primary 4', subjects: ['Maths', 'Science']},
    {name: 'Primary 5', subjects: ['Maths', 'Science']},
    {name: 'Primary 6', subjects: ['Maths', 'Science']}
  ];

  secondaryLevels = [
    {name: 'Secondary 1', subjects: ['Maths', 'Science']},
    {name: 'Secondary 2', subjects: ['Maths', 'Science']},
    {name: 'Secondary 3', subjects: ['E Maths', 'A Maths', 'Physics', 'Chemistry', 'Biology']},
    {name: 'Secondary 4', subjects: ['E Maths', 'A Maths', 'Physics', 'Chemistry', 'Biology']}
  ];

  collegeLevels = [
    {name: 'Junior College 1', subjects: ['H1 Maths', 'H2 Maths', 'H3 Maths']},
    {name: 'Junior College 2', subjects: ['H1 Maths', 'H2 Maths', 'H3 Maths']}
  ];

  internationalLevels = [
    {name: 'International Baccalaureatte', subjects: ['Maths Studies SL', 'Maths SL', 'Maths HL', 'Further Maths HL']}
  ];

  getRelatedSubjects(level:string) {
    let subjects = this.getSubjects(this.primaryLevels, level);
    if (subjects.length === 0) {
      subjects = this.getSubjects(this.secondaryLevels, level);
    }
    if (subjects.length === 0) {
      subjects = this.getSubjects(this.collegeLevels, level);
    }
    if (subjects.length === 0) {
      subjects = this.getSubjects(this.internationalLevels, level);
    }
    return subjects;
  }

  public getSubjects(levels, level) {
    let subjects = [];
    for (var i = 0; i < levels.length; i++) {
      if (levels[i].name === level) {
        subjects = levels[i].subjects
        break;
      }
    }
    return subjects;
  }
}