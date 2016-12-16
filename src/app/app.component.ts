import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar, Splashscreen, Push, NativeAudio, Badge } from 'ionic-native';

import { UserRolePage } from '../pages/user-role/user-role';
import { AnswerQuestionPage } from '../pages/answer-question/answer-question';
import { AnswerPage } from '../pages/answer/answer';
import { AnswerArrivedPage } from '../pages/answer-arrived/answer-arrived';
import { AnswerFeedbackPage } from '../pages/answer-feedback/answer-feedback';
import { AnswerSubmittedPage } from '../pages/answer-submitted/answer-submitted';
import { FeedbackPage } from '../pages/feedback/feedback';
import { QuestionPage } from '../pages/question/question';
import { QuestionSubmittedPage } from '../pages/question-submitted/question-submitted';
import { QuestionViewPage } from '../pages/question-view/question-view';
import { ScanQuestionPage } from '../pages/scan-question/scan-question';
import { SnapQuestionPage } from '../pages/snap-question/snap-question';

import { AuthService } from '../providers/auth';
import { StateService } from '../providers/state';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = UserRolePage;

  public pages:Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, public events: Events, public auth: AuthService, public state: StateService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Answer the Question', component: AnswerQuestionPage, icon: 'ios-help-outline'}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();


      try {
        NativeAudio.preloadSimple('question-sent', 'audio/question-sent.mp3');
        NativeAudio.preloadSimple('answer-received', 'audio/answer-received.mp3');
      } catch (error) {
        console.error(error);
      }

      try {
        var push = Push.init({
          android: {
            senderID: "852069923141"
          },
          ios: {
            alert: "true",
            badge: true,
            sound: 'true'
          },
          windows: {}
        });
        push.on('registration', (data) => {
          console.log(data.registrationId);
          this.auth.setDeviceToken(data.registrationId);
          //alert(data.registrationId.toString());
        });
        push.on('notification', (data) => {
          console.log(data);
          //alert(JSON.stringify(data));
        });
        push.on('error', (e) => {
          console.log(e.message);
          alert(JSON.stringify(e));
        });
      } catch (err) {
        console.error(err);
      }
      Badge.clear();
      this.state.navigateToAppropriatePage();

      this.listenToState();
    });
  }

  listenToState() {
    this.events.subscribe('root:user-role', (params) => {
      this.nav.setRoot(UserRolePage, params);
    });

    this.events.subscribe('root:answer', (params) => {
      this.nav.setRoot(AnswerPage, params);
    });

    this.events.subscribe('root:answer-arrived', (params) => {
      this.nav.setRoot(AnswerArrivedPage, params);
    });

    this.events.subscribe('root:answer-feedback', (params) => {
      this.nav.setRoot(AnswerFeedbackPage, params);
    });

    this.events.subscribe('root:answer-question', (params) => {
      this.nav.setRoot(AnswerQuestionPage, params);
    });

    this.events.subscribe('root:answer-submitted', (params) => {
      this.nav.setRoot(AnswerSubmittedPage, params);
    });

    this.events.subscribe('root:question', (params) => {
      this.nav.setRoot(QuestionPage, params);
    });

    this.events.subscribe('root:question-submitted', (params) => {
      this.nav.setRoot(QuestionSubmittedPage, params);
    });

    this.events.subscribe('root:question-view', (params) => {
      this.nav.setRoot(QuestionViewPage, params);
    });

    this.events.subscribe('root:scan-question', (params) => {
      this.nav.setRoot(ScanQuestionPage, params);
    });

    this.events.subscribe('root:snap-question', (params) => {
      this.nav.setRoot(SnapQuestionPage, params);
    });
    
    this.events.subscribe('nav:feedback', (params) => {
      this.nav.setRoot(FeedbackPage, params);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
