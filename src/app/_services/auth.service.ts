import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { AlertifyService } from './alertify.service';
import { Router } from '@angular/router';
import { API } from '../_config/constants.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = API.END_POINT;
  userToken;
  isLoggedIn: boolean = false;
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private http: Http,
              private alertify: AlertifyService,
              private router: Router) { }

  login(model: any) {
    return this.http.post(
        this.baseUrl + API.ACCOUNT.LOGIN, 
        model, 
        this.getNoAuthRequestOptions()
      ).pipe(map((response: Response) => {
        const user = response.json();
        if(user) {                                    // successful login
          console.log(user.jwt);                      //    - remove after development phase

          this.userToken = user.jwt;
          this.saveToLocalStorage(user);
        }
      }));
  }

  logout() {
    this.userToken = null;
    localStorage.removeItem('dpa-fullname');
    localStorage.removeItem('dpa-role');
    localStorage.removeItem('dpa-token');

    this.alertify.message('Logged out');              // NOTE: set app.component.ts canAccessApp = false
    this.router.navigate(['/login']);
  }

  // STATUS QUERY

  loggedIn() {
    return tokenNotExpired('dpa-token');
  }

  isAdmin() {
    const role = localStorage.getItem('dpa-role');
    return (role === 'Admin')  ? true : false;
  }

  // API HEADERS

  /* Purpose: return request options without the token; used in login */
  getNoAuthRequestOptions() {
    const headers = new Headers({'Content-type': 'application/json'});
    return new RequestOptions({headers: headers});
  }

  /* Purpose: Save returned user details if login is successful */
  saveToLocalStorage(user) {
    localStorage.setItem('dpa-userid', user.user.aspNetUserID);   // user details
    localStorage.setItem('dpa-username', user.user.userName);
    localStorage.setItem('dpa-fullname', user.user.fullName);
    localStorage.setItem('dpa-role', user.user.roleName);
    localStorage.setItem('dpa-token', user.jwt);                  // authentication token
  }
}
