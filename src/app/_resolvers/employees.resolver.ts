import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Employee } from "../_models/employee";
import { EmployeesService } from "../_services/employees.service";
import { AlertifyService } from "../_services/alertify.service";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import 'rxjs/add/observable/of'

@Injectable()
export class EmployeesResolver implements Resolve<Employee[]> {
  pageNumber = 1;
  pageSize = 10;

  constructor(private employeesService: EmployeesService,
              private router: Router,
              private alertify: AlertifyService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Employee[]> {
    return this.employeesService.getAllEmployees(this.pageNumber, this.pageSize)
              .pipe(catchError (err => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/dashboard']);
                return Observable.of(null);
              }));
  }
}