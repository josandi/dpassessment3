import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { AlertifyService } from "../_services/alertify.service";
import { AssessmentsService } from "../_services/assessments.service";
import { Assessment } from "../_models/assessment";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import 'rxjs/add/observable/of'
import { AuthService } from "../_services/auth.service";

@Injectable()
export class AssessmentsResolver implements Resolve<Assessment[]> {
  userId: number;
  isAdmin: boolean = true;
  pageNumber = 1;
  pageSize = 10;

  constructor(private asessmentsService: AssessmentsService,
              private authService: AuthService,
              private router: Router,
              private alertify: AlertifyService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Assessment[]> {
    this.isAdmin = this.authService.isAdmin();

    if (this.isAdmin) {                       // for admin: all assessments
      return this.asessmentsService.getAllAssessments(this.pageNumber, this.pageSize)
              .pipe(catchError (err => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['assessment/dashboard']);
                return Observable.of(null);
              }));
    } else {                                  // for non-admin; user-specific assessments
      let userId = Number(localStorage.getItem('dpa-userid'));

      return this.asessmentsService.getUserAssessments(userId, this.pageNumber, this.pageSize)
              .pipe(catchError (err => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['dashboard']);
                return Observable.of(null);
              }));
    } 

  }
  
}