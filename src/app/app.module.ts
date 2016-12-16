import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { AnswerPage } from '../pages/answer/answer';
import { AnswerArrivedPage } from '../pages/answer-arrived/answer-arrived';
import { AnswerFeedbackPage } from '../pages/answer-feedback/answer-feedback';
import { AnswerFeedbackNextPage } from '../pages/answer-feedback-2/answer-feedback-2';
import { AnswerQuestionPage } from '../pages/answer-question/answer-question';
import { AnswerSubmittedPage } from '../pages/answer-submitted/answer-submitted';
import { EmailCreatePage } from '../pages/email-create/email-create';
import { EmailLoginPage } from '../pages/email-login/email-login';
import { FeedbackPage } from '../pages/feedback/feedback';
import { QuestionPage } from '../pages/question/question';
import { QuestionSubmittedPage } from '../pages/question-submitted/question-submitted';
import { QuestionViewPage } from '../pages/question-view/question-view';
import { ScanQuestionPage } from '../pages/scan-question/scan-question';
import { SettingsPage } from '../pages/settings/settings';
import { SnapQuestionPage } from '../pages/snap-question/snap-question';
import { UserRolePage } from '../pages/user-role/user-role';

import { TextAreaFocuser } from '../components/textarea-focuser/textarea-focuser';

import { AnswerService } from '../providers/answer';
import { AuthService } from '../providers/auth';
import { EmailService } from '../providers/email';
import { GlobalVars } from '../providers/global-vars';
import { QuestionService } from '../providers/question';
import { SettingsModal } from '../providers/settings-modal';
import { WebService } from '../providers/web';
import { StateService } from '../providers/state';

@NgModule({
  declarations: [
    MyApp,
    AnswerPage,
    AnswerArrivedPage,
    AnswerFeedbackPage,
    AnswerFeedbackNextPage,
    AnswerQuestionPage,
    AnswerSubmittedPage,
    EmailCreatePage,
    EmailLoginPage,
    FeedbackPage,
    QuestionPage,
    QuestionSubmittedPage,
    QuestionViewPage,
    ScanQuestionPage,
    SettingsPage,
    SnapQuestionPage,
    UserRolePage,
    TextAreaFocuser
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AnswerPage,
    AnswerArrivedPage,
    AnswerFeedbackPage,
    AnswerFeedbackNextPage,
    AnswerQuestionPage,
    AnswerSubmittedPage,
    EmailCreatePage,
    EmailLoginPage,
    FeedbackPage,
    QuestionPage,
    QuestionSubmittedPage,
    QuestionViewPage,
    ScanQuestionPage,
    SettingsPage,
    SnapQuestionPage,
    UserRolePage
  ],
  providers: [
    AnswerService, 
    AuthService, 
    EmailService, 
    GlobalVars, 
    QuestionService,
    WebService,
    SettingsModal,
    StateService
  ]
})
export class AppModule {}
