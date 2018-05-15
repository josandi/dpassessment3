import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { EmployeeData, EmployeeAssessment } from '../_models/employee';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class EmployeesService {

    private baseUrl: string = 'http://13.75.89.123:881/api/';

    constructor(private http: Http) { }

    // main functions

    getAllEmployees() {
        return this.http.get(this.baseUrl + 'Employees', this.requestOptions())
            .pipe(map((response: Response) => {
                return response.json();
            })
        );
    }

    getEmployeeAssessments(empId) {
        return this.http.get('/assets/test-data/user-assessment-list.json')
            .pipe(map((response: Response) => {
                return response.json();
            })
        );
    }

    // utilities

    private requestOptions() {
        const headers = new Headers({
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        });
        return new RequestOptions({headers: headers});
    }
}