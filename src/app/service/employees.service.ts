import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { query } from '@angular/animations';

export interface EmployeeData {
    "employee_id": number,
    "firstname": string,
    "middlename": string,
    "lastname": string,
    "email_address": string,
    "contact_number": number,
    "position_id": number,
    "position": string
}


@Injectable()
export class EmployeesService {

    private _url: string = "/assets/test-data";

     constructor(private http:HttpClient) { }

     getAllEmployees() {
        return this.http.get<Array<EmployeeData>>(this._url + '/employees.json'/*, {
          headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token)
        }*/);
    }

    getEmployeeAssessments(empId) {
        return this.http.get<Array<EmployeeData>>(this._url + '/user-assessment-list.json'/*, {
          headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token)
        }*/);
    }

    // utilities
    getPositionList() {
        return this.http.get<Array<EmployeeData>>(this._url + '/employee-position.json'/*, {
          headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token)
        }*/);
    }

}