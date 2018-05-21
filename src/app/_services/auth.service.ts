import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://13.75.89.123:881/api/account/';
  userToken;
  isLoggedIn: boolean = false;

  constructor(private http: Http) { }

  login(model: any) {
    const headers = new Headers({'Content-type': 'application/json'});
    const options = new RequestOptions({headers: headers});

    return this.http.post(this.baseUrl + 'login', model, options)
      .pipe(map((response: Response) => {
        const user = response.json();
        if(user) {
          console.log(user.jwt);
          this.userToken = user.jwt;
          this.saveToLocalStorage(user);
        }
      }));
  }

  // STATUS QUERY

  loggedIn() {
    const token = localStorage.getItem('dpa-token');
    return !!token;
  }

  isAdmin() {
    const role = localStorage.getItem('dpa-role');
    return (role === 'Admin')  ? true : false;
  }

  // UTILITIES

  requestOptions() {
    const headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('dpa-token')
    });
    return new RequestOptions({headers: headers});
  }

  authorizedHeader() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('dpa-token'));
  }

  saveToLocalStorage(user) {
    localStorage.setItem('dpa-userid', user.user.aspNetUserID);
    localStorage.setItem('dpa-fullname', user.user.fullName);
    localStorage.setItem('dpa-role', user.user.roleName);
    localStorage.setItem('dpa-token', user.jwt);
  }
}
