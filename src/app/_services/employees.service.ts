
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { EmployeeData, EmployeeAssessment } from '../_models/employee';
import { API } from '../_config/constants.config';
import { AuthHttp } from 'angular2-jwt';

@Injectable({
  providedIn: "root"
})
export class EmployeesService {
  private baseUrl: string = API.END_POINT;

  constructor(private authHttp: AuthHttp) {}

  // API GET

  /* Purpose: get list of all employees */
  getAllEmployees() {
    return this.authHttp.get(
        this.baseUrl + API.EMPLOYEE.GET_ALL
      ).pipe( map((response: Response) => {
        return response.json();
      })
    );
  }

  /* Purpose: get all assessment status of specific employee */
  getAssessmentsStatusPerEmp(empId) {
    return this.authHttp.get(
        this.baseUrl + API.EMPLOYEE.GET_EMPLOYEE_ASSESSMENTS + empId
      ).pipe(map((response: Response) => {
        return response.json();
      })
    );
  }
}