import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Transfer } from 'ionic-native';

import { GlobalVars } from './global-vars';
import { AuthService } from './auth';

/*
  Generated class for the Answer provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AnswerService {

  constructor(public http: Http, public globalVars: GlobalVars, public auth: AuthService) {
    console.log('Hello Answer Provider');
  }

  public submitAnswer(questionId: number, answer: any) {
    let url = this.globalVars.getApiUrlPrefix()+'question/'+questionId+'/answer';
    answer.access_token = this.auth.getUserAccessToken();
    const fileTransfer = new Transfer();
    
    let options = {
      fileKey: 'image',
      fileName: 'answer.jpg',
      headers: {},
      params: answer
    };
    return fileTransfer.upload(answer.image, url, options);
  }

  public getAnswer(questionId: number) {
    let url = this.globalVars.getApiUrlPrefix()+'question/'+questionId+'/answer?access_token='+this.auth.getUserAccessToken();
    
    return this.http.get(url).map(res => res.json());
  }

  public voteAnswer(answerId: number, answerVote: any) {
    let url = this.globalVars.getApiUrlPrefix()+'answer/'+answerId+'/vote';
    answerVote.access_token = this.auth.getUserAccessToken();

    return this.http.post(url, answerVote).map(res => res.json());
  }
}
