import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  url: string = environment.backend_url;
  token: any;
  user: any;

  postMember(member) {
    return this.http.post(this.url+'/member', member, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json')
    });
  }

  postLogin(member) {
    return this.http.post(this.url+'/login', member, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json')
    });  
  }

  postEditedProfile(profile) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url+'/editedprofile', profile, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });
  }

  postPasswordRequest(member) {
    return this.http.post(this.url+'/forgotpassword', member, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json')
    });
  }
  
  resetPasswordRequest(password) {
    return this.http.post(this.url+'/resetpassword', password, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json')
    });
  }

  resetPasswordRequest1(password) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url+'/resetpassword1', password, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });
  }

  resetSecurityCredentials(securityCredentials) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url+'/resetSecurityCredentials', securityCredentials, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });
  }

  getProfile() {
   this.token = localStorage.getItem('id_token'); 
   return this.http.get(this.url+'/profile', {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    }); 
  }

  auth(data) {
    localStorage.setItem('id_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    this.token = data.token;
    this.user = data.user;
  }

  setUser(model) {
    localStorage.setItem('user', JSON.stringify(model.user));
    this.user = model.user;    
  }

  getUser() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  getToken() {
    if(!!localStorage.getItem('id_token')) {
      let token = localStorage.getItem('id_token');
      return this.checkExpiryDate(token); 
    } else return false;
  }

  checkExpiryDate(token) {
    const helper = new JwtHelperService();
    let isExpired = helper.isTokenExpired(token);
    return !isExpired;
  }

  checkUser() {
    this.getUser();
    if(this.user) {
      if(this.user.email != "admin@admin.com") return true;
      else return false;
    }
    else return false;
  }

  logout() {
    localStorage.clear();
    this.token = null;
    this.user = null;
  }

  postPassword(model) {
    this.token = localStorage.getItem('id_token'); 
    return this.http.post(this.url+'/checkPassword', model, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });
  }

  addMoney(amount) {
    this.token = localStorage.getItem('id_token'); 
    return this.http.post(this.url+'/addmoney', {amount: amount, _id: this.user._id}, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json').append('Authorization',this.token)
    });
  }  

}
