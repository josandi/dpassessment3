import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { API } from '../_config/constants.config';
import { AuthHttp } from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class AssessmentsService {
  private baseUrl: string = API.END_POINT;

  constructor(private authHttp: AuthHttp) { }

  // API GET

  getAllAssessments() {
    return this.authHttp.get(
        this.baseUrl + API.ASSESSMENT.GET_ALL
      ).pipe(map((response: Response) => {
        return response.json();  
      })
    );
  }

  getAssessmentDetail(assessmentId) {
    return this.authHttp.get(
        this.baseUrl + API.ASSESSMENT.GET_ONE + assessmentId
      ).pipe(map((response: Response) => {
          return response.json();  
        })
      );
  }

  getUserAssessments(employeeId) {
    return this.authHttp.get(
      this.baseUrl + API.EMPLOYEE.GET_EMPLOYEE_ASSESSMENTS + employeeId
    ).pipe(map((response: Response) => {
        return response.json().employeeAssessmentList;  
      })
    );
  }

  getQuestionnairesList() {
    return this.authHttp.get(
        this.baseUrl + API.QUESTIONNAIRE.GET_ALL
      ).pipe(map((response: Response) => {
        return response.json();  
      })
    );
  }

  /* Purpose: get all status of employees for the specific assessment */
  getEmpAssessmentStatus(assessmentId) {
    return this.authHttp.get(
        this.baseUrl + API.ASSESSMENT.GET_LIST_FOR_EMPLOYEE + assessmentId
      ).pipe(map((response: Response) => {
        return response.json();  
      })
    );
  }

  getEmpAssessmentQuestionnaire(assessmentId, employeeId) {
    return this.authHttp.get(
        this.baseUrl + API.EMP_ASSESSMENT.GET_QUESTIONS_WITH_ANSWERS + assessmentId + '/' + employeeId
      ).pipe(map((response: Response) => {
        return response.json();
      })
    );
  }

  // API POST

  saveAssessment(assessment) {
    return this.authHttp.post(
        this.baseUrl + API.ASSESSMENT.CREATE,
        assessment
      ).pipe(map((response: Response) => {
        return (response.ok) ? true : false;
      })
    );
  }

  saveEmployeeAssessment(empAssessment) {
    return this.authHttp.post(
        this.baseUrl + 'EmployeeAssessment/InsertEmployeeAssessment',
        empAssessment
      ).pipe(map((response: Response) => {
        console.log(response);
        return (response.ok) ? true : false;
      })
    );
  }

  // API PUT

  updateAssessment(assessment) {
    return this.authHttp.put(
        this.baseUrl + API.ASSESSMENT.UPDATE,
        assessment
      ).pipe(map((response: Response) => {
        return (response.ok) ? true : false;
      })
    );
  }

}