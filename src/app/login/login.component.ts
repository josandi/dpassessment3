import { Component, OnInit } from '@angular/core';
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
        this.router.navigate(['/dashboard']);
      }, error => {
        this.errorMsg = 'User cannot be found.';
      });
  }

}
