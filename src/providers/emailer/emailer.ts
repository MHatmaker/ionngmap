import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

export interface IEmailParts {
    body : {
      to: string;
      subject: string;
      text: string;
   }
}

export class EmailParts implements IEmailParts {
    public body : {
       to : string;
       subject : string;
       text : string;
    }
    constructor(public parts : IEmailParts) {
    }
}

@Injectable()
export class EmailerProvider {
  private url : string = 'https://maplinkr.herokuapp.com/send-email'
  constructor(public http: Http) {
    console.log('Hello EmailerProvider Provider');
  }

  sendEmail(mailparts : EmailParts) {

  	  let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.url, JSON.stringify(mailparts), options)
                 .map(this.extractData)
                 .catch(this.handleErrorObservable);
  }

  private extractData(res: Response) {
    	let body = res.json();
          return body || {};
  }

  private handleErrorObservable (error: Response | any) {
    	console.error(error.message || error);
    	return Observable.throw(error.message || error);
  }
}
