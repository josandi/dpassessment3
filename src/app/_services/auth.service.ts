import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { AlertifyService } from './alertify.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://13.75.89.123:881/api/';
  userToken;
  isLoggedIn: boolean = false;
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private http: Http,
              private alertify: AlertifyService,
              private router: Router) { }

  login(model: any) {
    return this.http.post(this.baseUrl + 'Account/login', 
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

  /* Purpose: return request options with the authentication token */
  requestOptions() {
    // let dpaToken = this.getValidToken();                 // function to check valid refresh token

    const headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('dpa-token')
    });
    return new RequestOptions({headers: headers});
  }

  requestOptionWithExpiredToken() {
    const headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('dpa-token')
    });
    return new RequestOptions({headers: headers});
  }

  /* Purpose: return request options without the token; used in login */
  getNoAuthRequestOptions() {
    const headers = new Headers({'Content-type': 'application/json'});
    return new RequestOptions({headers: headers});
  }

  /* Purpose: return header for HttpClient calls; currently not used */
  authorizedHeader() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('dpa-token'));
  }

  // TOKEN-RELATED UTILITIES

  /* Purpose: sets token expiry based on the decoded token */

  getValidToken() {
    let validToken = localStorage.getItem('dpa-token');
    let currTime = new Date().getTime() / 1000;
    let tokenExpiry = this.jwtHelper.decodeToken(validToken).exp;

    console.log(currTime + ' - ' + tokenExpiry);
    if (currTime > (tokenExpiry - 60)) {       // should refresh token w/ 3mins leeway before the expiry
      console.log('Token has expired. Refresh token.');
      
      // --------
      let user: any = {};
      user.userID = localStorage.getItem('dpa-userid');
      user.username = localStorage.getItem('dpa-username');
      user.roleName = localStorage.getItem('dpa-role');
      console.log(user);

      return this.http.post(this.baseUrl + 'Account/RefreshToken', 
          user, 
          this.requestOptionWithExpiredToken()
        ).pipe(map((response: Response) => {
          let newToken = response.json();

          if(newToken.jwt) {                      // if refresh is successful: save and return new token
            console.log('New token successfully generated: ' + newToken.jwt);

            localStorage.setItem('dpa-token', newToken.jwt);
            return newToken.jwt;
          } else {                                // otherwise: signout and return null
            this.logout();
            return 'Unsuccessful refresh';
          }
        }));

        
      // --------
    }

    return validToken;
  }

  refreshToken() {

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
