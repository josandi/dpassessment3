import { NgModule } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AuthHttp, AuthConfig, tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { map, catchError } from 'rxjs/operators';
import { API } from '../_config/constants.config';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {

  /* Main function from jwt2-angular */
  return new AuthHttp(new AuthConfig({
    tokenName: 'dpa-token',
    tokenGetter: (() => {
      let tryToken =  getValidToken();
      return tryToken;
    }),
    globalHeaders: [{'Content-type': 'application/json'}],
  }), http, options);

  // MODIFIED FUNCTIONALITIES TO VALIDATE TOKEN //

  /* Purpose: get valid token based on the current token's expiry */
  function getValidToken(): Promise<string> {
    let jwtHelper: JwtHelper = new JwtHelper();
    let validToken = localStorage.getItem('dpa-token');
    let currTime = new Date().getTime() / 1000;
    let tokenExpiry = jwtHelper.decodeToken(validToken).exp;
  
    if (currTime > (tokenExpiry - 180)) {                   // reduce token expiry to give allowance
      return new Promise((resolve, reject) => {             // if almost expired: call TokenRefresh using current creds
        refreshToken().subscribe(
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
  
    return Promise.resolve(validToken);                     // if not expired: use current token
  }
  
  /* Purpose: call RefreshToken endpoint using current creds */
  function refreshToken() {
    let user: any = {};
    user.userID = localStorage.getItem('dpa-userid');       // get user creds from local storage
    user.username = localStorage.getItem('dpa-username');
    user.roleName = localStorage.getItem('dpa-role');
  
    return http.post(
      API.END_POINT + API.ACCOUNT.REFRESH_TOKEN, 
      user, 
      requestOptionWithCurrentToken()                       // use current token to call refresh endpoint
    ).pipe(map((response: Response) => {
      let newToken: any = response.json();
  
      if(newToken.jwt) {                                    // if refresh is successful: save and return new token
        console.log('New token successfully generated: ' + newToken.jwt);
        localStorage.setItem('dpa-token', newToken.jwt);
        return newToken.jwt;
      } else {                                              // otherwise: signout and return null
        localStorage.removeItem('dpa-fullname');            // should logout here - problem is different module
        localStorage.removeItem('dpa-role');                //   --> this is in case refresh is called when the current token has already expired
        localStorage.removeItem('dpa-token');               //   --> that's why we probably need a longer-lived refresh token for refresh authentications

        return null;
      }
    }), 
    catchError (err => {
      console.log('Refresh Token Error: ' + err);
      return null;
    }) );
  }
  
  /* Purpose: use the current token in the header for the refresh */
  function requestOptionWithCurrentToken() {
    const headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('dpa-token')
    });
    return new RequestOptions({headers: headers});
  }
}

// MODULE //
@NgModule({
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ]
})
export class AuthModule { }
