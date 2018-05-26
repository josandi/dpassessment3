import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { API } from '../_config/constants.config';
import { AuthHttp } from 'angular2-jwt';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentsService {
  private baseUrl: string = API.END_POINT;

  constructor(private authHttp: AuthHttp,
              private err: ErrorService) { }

  // API GET

  /* Purpose: get all assessments */
  getAllAssessments() {
    return this.authHttp.get(
        this.baseUrl + API.ASSESSMENT.GET_ALL
      ).pipe(map((response: Response) => {
        return response.json();  
      })
    );
  }

  /* Purpose: get details of a specific assessment */
  getAssessmentDetail(assessmentId) {
    return this.authHttp.get(
        this.baseUrl + API.ASSESSMENT.GET_ONE + assessmentId
      ).pipe(map((response: Response) => {
          return response.json();  
        })
      );
  }

  /* Purpose: get all assessments of a specific employee */
  getUserAssessments(employeeId) {
    return this.authHttp.get(
      this.baseUrl + API.EMPLOYEE.GET_EMPLOYEE_ASSESSMENTS + employeeId
    ).pipe(map((response: Response) => {
        return response.json().employeeAssessmentList;  
      })
    );
  }

  /* Purpose: get a list of all questionnaires; used in add/edit assessment */
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
        this.baseUrl + API.ASSESSMENT.GET_EMPLOYEE_STATUS + assessmentId
      ).pipe(map((response: Response) => {
        return response.json();  
      })
    );
  }

  /* Purpose: get employee assessment with answers*/
  getEmpAssessmentQuestionnaire(assessmentId, employeeId) {
    return this.authHttp.get(
        this.baseUrl + API.EMP_ASSESSMENT.GET_QUESTIONS_WITH_ANSWERS + assessmentId + '/' + employeeId
      ).pipe(map((response: Response) => {
        return response.json();
      })
    );
  }

  // API POST

  /* Purpose: add new assessment */
  saveAssessment(assessment) {
    return this.authHttp.post(
        this.baseUrl + API.ASSESSMENT.CREATE,
        assessment
      ).pipe(map((response: Response) => {
        return (response.ok) ? true : false;
      }), catchError(this.err.handleAPIError));
  }

  /* Purpose: submit answered employee assessment*/
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

  /* Purpose: update detail of a specific assessment */
  updateAssessment(assessment) {
    return this.authHttp.put(
        this.baseUrl + API.ASSESSMENT.UPDATE,
        assessment
      ).pipe(map((response: Response) => {
        return (response.ok) ? true : false;
      }), catchError(this.err.handleAPIError));
  }

}