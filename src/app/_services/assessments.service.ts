import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { API } from '../_config/constants.config';

@Injectable({
  providedIn: 'root'
})
export class AssessmentsService {
  private baseUrl: string = API.END_POINT;

  constructor(private http: Http,
              private authService: AuthService) { }

  // API GET

  getAllAssessments() {
    return this.http.get(
        this.baseUrl + API.ASSESSMENT.GET_ALL, 
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
        return response.json();  
      })
    );
  }

  getAssessmentDetail(assessmentId) {
    return this.http.get(
        this.baseUrl + API.ASSESSMENT.GET_ONE + assessmentId, 
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
          return response.json();  
        })
      );
  }

  getUserAssessments(employeeId) {
    return this.http.get(
      this.baseUrl + API.EMPLOYEE.GET_EMPLOYEE_ASSESSMENTS + employeeId, 
      this.authService.requestOptions()
    ).pipe(map((response: Response) => {
        return response.json().employeeAssessmentList;  
      })
    );
  }

  getQuestionnairesList() {
    return this.http.get(
        this.baseUrl + API.QUESTIONNAIRE.GET_ALL, 
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
        return response.json();  
      })
    );
  }

  /* Purpose: get all status of employees for the specific assessment */
  getEmpAssessmentStatus(assessmentId) {
    return this.http.get(
        this.baseUrl + API.ASSESSMENT.GET_LIST_FOR_EMPLOYEE + assessmentId, 
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
        return response.json();  
      })
    );
  }

  getEmpAssessmentQuestionnaire(assessmentId, employeeId) {
    return this.http.get(
        this.baseUrl + API.EMP_ASSESSMENT.GET_QUESTIONS_WITH_ANSWERS + assessmentId + '/' + employeeId, 
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
        return response.json();
      })
    );
  }

  // API POST

  saveAssessment(assessment) {
    return this.http.post(
        this.baseUrl + API.ASSESSMENT.CREATE,
        assessment,
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
        return (response.ok) ? true : false;
      })
    );
  }

  saveEmployeeAssessment(empAssessment) {
    return this.http.post(
        this.baseUrl + 'EmployeeAssessment/InsertEmployeeAssessment',
        empAssessment,
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
        console.log(response);
        return (response.ok) ? true : false;
      })
    );
  }

  // API PUT

  updateAssessment(assessment) {
    return this.http.put(
        this.baseUrl + API.ASSESSMENT.UPDATE,
        assessment ,
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
        return (response.ok) ? true : false;
      })
    );
  }

}