import { Component } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  canAccessApp: boolean = this.authService.loggedIn();

  constructor(private authService: AuthService,
              private router: Router ) { }

  logout() {
    this.authService.userToken = null;
    localStorage.removeItem('token');
    console.log('Logged out');

    this.canAccessApp = false;
    this.router.navigate(['/login']);
  }

  loginUserMode(loginMode: boolean) {
    this.canAccessApp = loginMode;
  }
}