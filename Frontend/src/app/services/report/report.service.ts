import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

	token: any;
	url: string = '';

  constructor(private _http: HttpClient) { }

  categorywiseReport() {
  	//this.token = localStorage.getItem('id_token');
    return this._http.get("/assets/reportCategorySample.json")/*, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    })*/
      .pipe(map(result => result));
  }

  monthlyReport() {
    //this.token = localStorage.getItem('id_token');
    return this._http.get("/assets/reportMonthlySample.json")/*, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    })*/
      .pipe(map(result => result));
  }

  postYear(model) {
    this.token = localStorage.getItem('id_token');
  	return this._http.post(this.url + '/generateReport', model, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });
  }

}
