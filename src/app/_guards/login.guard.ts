import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.loggedIn()) {          // cannot access login page when already logged in
      this.router.navigate(['dashboard']);
      return false;
    }      

    return true;
  }
}
