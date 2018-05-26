import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model: any = {};
  errorMsg = '';
  @Output() loginUser = new EventEmitter();

  constructor(private authService: AuthService,
              private router: Router,
              private alertify: AlertifyService ) { }

  ngOnInit() {
  }

  // MAIN FUNCTIONS

  /* Purpose: login to the app */
  login() {
    this.model.rememberMe = true;
    this.authService.login(this.model)
      .subscribe(data => {
        this.alertify.success("Logged in successfully!");
        this.loginUser.emit(true);                        // triggers function in the app component: to show/hide the sidebar based on the user type
        this.router.navigate(['/dashboard']);
      }, error => {
        this.errorMsg = 'User cannot be found.';
      });
  }

}
