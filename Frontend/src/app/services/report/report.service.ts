import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

	token: any;
  url: string = 'http://127.0.0.1:3000/users';

  constructor(
    private http: HttpClient
  ) { }

  postYear(model) {
    this.token = localStorage.getItem('id_token');
  	return this.http.post(this.url + '/generatereport', model, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });
  }

  postUserGroup(model) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url + '/generateusergroupreport', model, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });
  }  

  postUser(model) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url + '/generateuserreport', model, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });
  }  

}
