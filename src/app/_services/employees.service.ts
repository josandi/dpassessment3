
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Employee } from '../_models/employee';
import { API } from '../_config/constants.config';
import { AuthHttp } from 'angular2-jwt';
import { ErrorService } from './error.service';
import { PaginatedResult } from '../_models/pagination';
import { environment } from '../../environments/environment';
import { RElement } from '@angular/core/src/render3/interfaces/renderer';

@Injectable({
  providedIn: "root"
})
export class EmployeesService {
  private baseUrl: string = environment.apiUrl;

  constructor(private authHttp: AuthHttp,
              private error: ErrorService) {}

  // API GET

  /* Purpose: get employees based on pagination */
  getAllEmployees(page?: number, itemsPerPage?: number) {
    const paginatedResult: PaginatedResult<Employee[]> = new PaginatedResult<Employee[]>();
    let queryStr = '?';
    if(page != null && itemsPerPage != null) {
      queryStr += 'PageNumber=' + page + '&PageSize=' + itemsPerPage;
    }

    return this.authHttp.get(
        this.baseUrl + API.EMPLOYEE.GET_ALL + queryStr
      ).pipe( map((response: Response) => {
        paginatedResult.result = response.json();
        if(response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

  /* Purpose: get list of all employees - without regards of pagination */
  getEmployeesList() {
    const queryAll = '?PageNumber=1&PageSize=1000';

    return this.authHttp.get(
      this.baseUrl + API.EMPLOYEE.GET_ALL + queryAll
    ).pipe(map((response: Response) => {
      return response.json();
    }), catchError(this.error.handleAPIError));
  }

  /* Purpose: get all assessment status of specific employee */
  getAssessmentsStatusPerEmp(empId) {
    return this.authHttp.get(
        this.baseUrl + API.EMPLOYEE.GET_EMPLOYEE_ASSESSMENTS + empId
      ).pipe(map((response: Response) => {
        return response.json();
      }), catchError(this.error.handleAPIError));
  }
}