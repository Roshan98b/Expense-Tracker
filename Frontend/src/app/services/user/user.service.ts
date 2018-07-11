import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
/*import { tokenNotExpired } from '@auth0/angular-jwt';*/
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService
  ) { }

  url: string = 'http://127.0.0.1:3000/users';
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
    /*this.isAuthenticated();*/
    
  }
  
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('id_token');
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  /*//extra
  loadToken() {
    const token = localStorage.getItem('id_token');
    this.token = token;
  }
//extra
  loggedIn()
  {
    return tokenNotExpired();
  }*/


  setUser(model) {
    localStorage.setItem('user', JSON.stringify(model.user));
    this.user = model.user;    
  }

  getUser() {
    this.user = JSON.parse(localStorage.getItem('user'));
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

}
