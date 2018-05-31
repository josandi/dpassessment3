import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { AlertifyService } from './alertify.service';
import { Router } from '@angular/router';
import { API } from '../_config/constants.config';
import { ErrorService } from './error.service';

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
              private router: Router,
              private err: ErrorService) { }

  // MAIN FUNCTIONS

  /* Purpose: submit login credentials to api */
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
      }), catchError(this.err.handleAPIError));
  }

  /* Purpose: remove items from local storage */
  logout() {
    this.userToken = null;
    localStorage.removeItem('dpa-fullname');
    localStorage.removeItem('dpa-role');
    localStorage.removeItem('dpa-token');

    this.alertify.message('Logged out');              // NOTE: set app.component.ts canAccessApp = false
    this.router.navigate(['login']);
  }

  // TOKEN VALIDATION //

  /* Purpose: get valid token based on the current token's expiry */
  getValidToken(): Promise<string> {
    let validToken = localStorage.getItem('dpa-token');
    let currTime = new Date().getTime() / 1000;
    let tokenExpiry = this.jwtHelper.decodeToken(validToken).exp;
    
    if (currTime > (tokenExpiry - 180)) {                       // reduce token expiry to give allowance    
      return new Promise((resolve, reject) => {                 // if almost expired: call TokenRefresh using current creds
        this.refreshToken().subscribe(
          success => {
            localStorage.setItem('dpa-token', success);
            resolve(success);
          },
          error => {
            resolve(validToken);
          }
        );
      });
    }

    return Promise.resolve(validToken);                         // if not expired: use current token
  }

  /* Purpose: call RefreshToken endpoint using current creds */
  refreshToken() {
    let user: any = {};
    user.userID = localStorage.getItem('dpa-userid');           // get user creds from local storage
    user.username = localStorage.getItem('dpa-username');
    user.roleName = localStorage.getItem('dpa-role');

    return this.http.post(
      this.baseUrl + API.ACCOUNT.REFRESH_TOKEN, 
      user, 
      this.requestOptionWithCurrentToken()
    ).pipe(map((response: Response) => {
      let newToken = response.json();

      if(newToken.jwt) {                                        // if refresh is successful: save and return new token
        console.log('New token successfully generated: ' + newToken.jwt);
        localStorage.setItem('dpa-token', newToken.jwt);
        return newToken.jwt;
      } else {                                              // otherwise: signout and return null
        this.logout();                                      //   --> this is in case refresh is called when the current token has already expired
        localStorage.removeItem('dpa-fullname');            //   --> that's why we probably need a longer-lived refresh token for refresh authentications
        localStorage.removeItem('dpa-role');
        localStorage.removeItem('dpa-token');
        
        return null;
      }
    }), 
    catchError (err => {
      console.log('Refresh Token Error: ' + err);
      return null;
    }) );
  }

  /* Purpose: use the current token in the header for the refresh */
  requestOptionWithCurrentToken() {
    const headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('dpa-token')
    });
    return new RequestOptions({headers: headers});
  }

  // UTILITIES

  /* Purpose: Save returned user details if login is successful */
  saveToLocalStorage(user) {
    localStorage.setItem('dpa-userid', user.user.aspNetUserID);   // user details
    localStorage.setItem('dpa-username', user.user.userName);
    localStorage.setItem('dpa-fullname', user.user.fullName);
    localStorage.setItem('dpa-role', user.user.roleName);
    localStorage.setItem('dpa-token', user.jwt);                  // authentication token
  }

  /* Purpose: check login status of user */
  loggedIn() {
    return tokenNotExpired('dpa-token');
  }

  /* Purpose: check if logged in user is admin */
  isAdmin() {
    const role = localStorage.getItem('dpa-role');
    return (role === 'Admin')  ? true : false;
  }

  /* Purpose: return request options without the token; used in login since there's no token yet */
  getNoAuthRequestOptions() {
    const headers = new Headers({'Content-type': 'application/json'});
    return new RequestOptions({headers: headers});
  }
}
