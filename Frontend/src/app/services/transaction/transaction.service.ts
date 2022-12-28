import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
		private http: HttpClient
  ) { }

  url: string = environment.backend_url;
  token: any;
  initial = [];
  approved = [];
  unapproved = [];
  completed = [];

  postBill(bill) {
  	this.token = localStorage.getItem('id_token');
    return this.http.post(this.url+'/bill', bill, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });
  }

  getInitialTransactions(groupId) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url+'/initialtransaction', {groupId: groupId}, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });    
  }
    
  getApprovedTransactions(groupId) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url+'/approvedtransaction', {groupId: groupId}, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });    
  }

  getUnapprovedTransactions(groupId) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url+'/unapprovedtransaction', {groupId: groupId}, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });    
  }

  getCompletedTransactions(groupId) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url+'/completedtransaction', {groupId: groupId}, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });    
  }  

  getGroupExpense(groupId, year) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url+'/groupexpense', {groupId: groupId, year: year}, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });        
  }

  updatePoll(model) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url+'/updatepoll', model, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });            
  }

  checkComplete(groupId) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url+'/checkcomplete', {groupId: groupId}, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });    
  }

  changeStatus(groupId) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url+'/changestatus', {groupId: groupId}, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });
  }

  billPayment(model) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url+'/billpayment', model, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });    
  }

  updateToInitial(model) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url+'/updatetoinitial', model, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });        
  }

  deleteTransaction(_id) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url+'/deletetransaction', {_id: _id}, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });    
  }

}
