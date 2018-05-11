import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

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
              private router: Router ) { }

  ngOnInit() {
  }

  login() {
    this.model.rememberMe = true;
    this.authService.login(this.model).subscribe(data => {
        console.log("Logged in successfully!");

        this.loginUser.emit(true);
        this.router.navigate(['/dashboard']);
      }, error => {
        this.errorMsg = 'User cannot be found.';
      });
  }

}
