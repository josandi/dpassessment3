import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { EmployeeData, EmployeeAssessment } from '../_models/employee';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class EmployeesService {

    private baseUrl: string = 'http://13.75.89.123:881/api/';

    constructor(private http: Http,
                private authService: AuthService) { }

    // API GET

    getAllEmployees() {
        return this.http.get(this.baseUrl + 'Employees', this.authService.requestOptions())
            .pipe(map((response: Response) => {
                return response.json();
            })
        );
    }

    /* Purpose: get all assessment status of specific employee */
    getAssessmentsStatusPerEmp(empId) {
      return this.http.get(
            this.baseUrl + 'Employees/GetEmployeeAssessmentDetail/' + empId,
            this.authService.requestOptions()
        ).pipe(map((response: Response) => {
            return response.json();  
        })
      );
    } 
}