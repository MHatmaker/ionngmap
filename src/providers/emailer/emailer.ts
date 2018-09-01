import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';

import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

export interface IEmailAddress {
    Email : string;
}

export interface IEmailParts {
    to: [IEmailAddress];
    subject: string;
    text: string;
}

export class EmailParts implements IEmailParts {
       to : [IEmailAddress];
       subject : string;
       text : string;

    constructor(public parts : IEmailParts) {
    }
}

@Injectable()
export class EmailerProvider {
  private url : string = 'https://maplinkr-simpleserver.herokuapp.com/send-email';
  constructor(public http: HttpClient) {
    console.log('Hello EmailerProvider Provider');
  }

  sendEmail(mailparts : EmailParts) {

  	  // let headers = new Headers({ 'Content-Type': 'application/json' });
      // let options = new RequestOptions({ headers: headers });
      // let jstring = JSON.stringify(mailparts.parts);
      return this.http.post(this.url, mailparts.parts).subscribe(
        (val) => {
            console.log("POST call successful value returned in body",
                        val);
        },
        response => {
            console.log("POST call in error", response);
        },
        () => {
            console.log("The POST observable is now completed.");
        });
                //  .map(this.extractData)
                //  .catch(this.handleErrorObservable);
      // return this.http.post(this.url, jstring, options)
      //            .map(this.extractData)
      //            .catch(this.handleErrorObservable);
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
