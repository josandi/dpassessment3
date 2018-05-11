import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://13.75.89.123:881/api/account/';
  userToken: any;
  isLoggedIn: boolean = false;

  constructor(private http: Http) { }

  login(model: any) {
    const headers = new Headers({'Content-type': 'application/json'});
    const options = new RequestOptions({headers: headers});

    return this.http.post(this.baseUrl + 'login', model, options)
                    .pipe(map((response: Response) => {
                      const user = response.json();
                      if(user) {
                        localStorage.setItem('token', user.jwt);
                        this.userToken = user.jwt;
                      }
                    }));
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  
}
