import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable()
export class AuthGuard implements CanActivate {
  adminOnlyPageUrls: string[] = [                   // add page urls or paths for admin-only pages
    '/employees',
    '/questionnaires'
  ];

  constructor(private authService: AuthService,
              private router: Router,
              private alertify: AlertifyService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if(this.authService.loggedIn()) {
      if(this.authService.isAdmin()) {              // if admin: all pages are accessible
        return true;
      } else {
        if(!this.forAdminOnlyPage(state.url)) {     // if user only: check page accessibility first
          return true;
        } else {
          this.router.navigate(['/dashboard']);
          return false;
        }
      }  
    }

    this.alertify.error('You need to login to access this page');
    this.router.navigate(['/login']);
    return false;
  }

  // UTILITIES

  /* Purpose: Check if page the user is trying to access is for admin only */
  forAdminOnlyPage(url) {
    return (this.adminOnlyPageUrls.indexOf(url) > -1) ? true : false;
  }
}
