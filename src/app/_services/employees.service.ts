import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { EmployeeData, EmployeeAssessment } from '../_models/employee';
import { AuthService } from './auth.service';
import { API } from '../_config/constants.config';

@Injectable({
    providedIn: 'root'
})
export class EmployeesService {

    private baseUrl: string = API.END_POINT;

    constructor(private http: Http,
                private authService: AuthService) { }

    // API GET

    getAllEmployees() {
        return this.http.get(
                this.baseUrl + API.EMPLOYEE.GET_ALL, 
                this.authService.requestOptions()
            )
                .pipe(map((response: Response) => {
                    return response.json();
                })
            );
    }

    /* Purpose: get all assessment status of specific employee */
    getAssessmentsStatusPerEmp(empId) {
      return this.http.get(
            this.baseUrl + API.EMPLOYEE.GET_EMPLOYEE_ASSESSMENTS + empId,
            this.authService.requestOptions()
        ).pipe(map((response: Response) => {
            return response.json();  
        })
      );
    } 
}