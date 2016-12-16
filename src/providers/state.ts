import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Events } from 'ionic-angular';

import { AuthService } from './auth';

/*
  Generated class for the State provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class StateService {

  storage = new Storage();

  constructor(public auth: AuthService, public events: Events) {
    console.log('Hello State Provider');
  }

  setCurrentPage (role: string, pageName: string, parameters: any) {    
    if (parameters !== undefined && parameters !== null) {
			this.storage.set(role + '_parameters', JSON.stringify(parameters));
		} else {
			this.storage.remove(role + '_parameters');
		}
    
    return this.storage.set(role + '_page_name', pageName);
  }

  clearPage(role: string) {
    return this.storage.remove(role+'_page_name');
  }

  getPageNamePromise(role: string){
    return this.storage.get(role+'_page_name');
  }

  getParametersPromise(role: string){
    return this.storage.get(role+'_parameters');
  }

  navigateToAppropriatePage() {
    this.auth.getRolePromise().then(role => {
    	console.log("Get Role Promise");

      if (role == null) {
        console.log("Role is null");

        this.events.publish('root:user-role');
        return;
      }
	
		if (role === 'student') {
			console.log("Role is Student");
			this.navigateToStudent(role);
		} else {
			console.log("Role is Tutor");
			this.navigateToTutor(role);
		}
    });
  }

	navigateToTutor(role) {
		console.log("Navigate to Tutor");
		this.auth.getUserPromise().then(usr => {

			if (usr !== undefined) {
				this.handlePageNamePromise(role, 'scan-question');
			} else {
				this.events.publish('root:scan-question');
			}
		})
	}

	handlePageNamePromise(role, defaultPage) {
		this.getPageNamePromise(role).then(pageName => {

			if (pageName) {
				this.displayPage(pageName, role);
				return;
			}
			this.events.publish('root:' + defaultPage);
		})
	}

	navigateToStudent(role) {
		console.log("Navigate to student");

	  	this.auth.getUserPromise().then(usr => {

			if (usr !== undefined) {
				this.handlePageNamePromise(role, 'snap-question');
			} else {
				console.log("User is undefined. Setting root as user role page");
		  	  this.events.publish('root:user-role');
			}
		})
	}

  displayPage(pageName, role) {
  	this.getParametersPromise(role).then(parameters => {
  	  let params = undefined;
  	  if(parameters !== undefined && parameters !== null){
  	    params = JSON.parse(parameters);
  	  }
  	  this.events.publish('root:' + this.getPageComponent(pageName), params);
  	});
  }

  public getPageComponent(pageName: string){
    let page = undefined;
    switch(pageName){
      case 'AnswerPage': page = 'answer';
        break;
      case 'AnswerArrivedPage': page = 'answer-arrived';
        break;
      case 'AnswerFeedbackPage': page = 'answer-feedback';
        break;
      case 'AnswerQuestionPage': page = 'answer-question';
        break;
      case 'AnswerSubmittedPage': page = 'answer-submitted';
        break;
      case 'QuestionPage': page = 'question';
        break;
      case 'QuestionSubmittedPage': page = 'question-submitted';
        break;
      case 'QuestionViewPage': page = 'question-view';
        break;
      case 'ScanQuestionPage': page = 'scan-question';
        break;
      case 'SnapQuestionPage': page = 'snap-question';
        break;
      default: page = 'user-role';
    }
    return page;
  }
}
