import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'app';
  user: any = {};
  canAccessApp: boolean = this.authService.loggedIn();

  constructor(private authService: AuthService,
              private router: Router ) { }

  ngOnInit() {
    this.setUserDetails();
  }

  logout() {
    this.authService.userToken = null;
    localStorage.removeItem('dpa-fullname');
    localStorage.removeItem('dpa-role');
    localStorage.removeItem('dpa-token');

    this.canAccessApp = false;
    this.router.navigate(['/login']);
  }

  /* Purpose: Called after login to show sidebar */
  loginUserMode(loginMode: boolean) {
    this.canAccessApp = loginMode;
    this.setUserDetails();
  }

  /* Purpose: Set sidebar's user details */
  setUserDetails() {
    this.user.fullname = localStorage.getItem('dpa-fullname');
    this.user.role = localStorage.getItem('dpa-role');
    this.user.isAdmin = this.authService.isAdmin();
  }
}