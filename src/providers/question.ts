import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Transfer } from 'ionic-native';

import { GlobalVars } from './global-vars';
import { AuthService } from './auth';
/*
  Generated class for the Question provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class QuestionService {

  constructor(public http: Http, public globalVars: GlobalVars, public auth: AuthService) {
    console.log('Hello Question Provider');
  }

  public submitQuestion(question: any) {
    let url = this.globalVars.getApiUrlPrefix()+'question/';
    question.access_token = this.auth.getUserAccessToken();
    const fileTransfer = new Transfer();

    let options = {
      fileKey: 'image',
      fileName: 'question.jpg',
      headers: {},
      params: question
    };
    return fileTransfer.upload(question.image, url, options);
  }

  public questionStatus(questionId: number) {
    let url = this.globalVars.getApiUrlPrefix()+'question/'+questionId+'/status?access_token='+this.auth.getUserAccessToken();

    return this.http.get(url).map(res => res.json());
  }

  public getQuestion(questionId: number) {
    let url = this.globalVars.getApiUrlPrefix()+'question/'+questionId+'?access_token='+this.auth.getUserAccessToken();

    return this.http.get(url).map(res => res.json());
  }

  public scannedQuestion(url: string) {
    return this.http.get(url).map(res => res.json());
  }

  public cancelQuestion(questionId: string, userId: string) {
    let url = this.globalVars.getApiUrlPrefix()+'question/'+questionId+'/cancel';
    let cancelRequest = {uid: userId, access_token:this.auth.getUserAccessToken()};

    return this.http.post(url, cancelRequest).map(res => res.json());
  }
}
