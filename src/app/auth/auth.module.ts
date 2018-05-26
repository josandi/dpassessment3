import { NgModule } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AuthHttp, AuthConfig, tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { map, catchError } from 'rxjs/operators';
import { API } from '../_config/constants.config';
import { AuthService } from '../_services/auth.service';

export function authHttpServiceFactory(http: Http, options: RequestOptions, authService: AuthService) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'dpa-token',
    tokenGetter: (() => {
      let tryToken =  authService.getValidToken();
      return tryToken;
    }),
    globalHeaders: [{'Content-type': 'application/json'}],
  }), http, options);

}

@NgModule({
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions, AuthService]
    }
  ]
})
export class AuthModule { }
