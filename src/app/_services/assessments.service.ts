import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssessmentsService {
  private baseUrl: string = "http://13.75.89.123:881/api/";

  constructor(private http: Http,
              private authService: AuthService) { }

  // API GET

  getAllAssessments() {
    return this.http.get(this.baseUrl + 'Assessment/GetAllAssessments', this.authService.requestOptions())
      .pipe(map((response: Response) => {
        return response.json();  
      })
    );
  }

  getAssessmentDetail(assessmentId) {
    return this.http.get(
        this.baseUrl + 'Assessment/' + assessmentId, 
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
          return response.json();  
        })
      );
  }

  getUserAssessments(employeeId) {
    return this.http.get('assets/test-data/user-assessment-list.json', this.authService.requestOptions())
      .pipe(map((response: Response) => {
        return response.json().data;  
      })
    );
  }

  getQuestionnairesList() {
    return this.http.get(this.baseUrl + 'Questionaire', this.authService.requestOptions())
      .pipe(map((response: Response) => {
        return response.json();  
      })
    );
  }

  /* Purpose: get all status of employees for the specific assessment */
  getEmpAssessmentStatus(assessmentId) {
    return this.http.get(
        this.baseUrl + 'Assessment/EmployeeAssessmentList_Get/' + assessmentId, 
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
        return response.json();  
      })
    );
  }

  getEmpAssessmentQuestionnaire(assessmentId, employeeId) {
    return this.http.get(
        this.baseUrl + 'EmployeeAssessment/GetQuestionWithAns/' + assessmentId + '/' + employeeId, 
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
        return response.json();
      })
    );
  }

  // API POST

  saveAssessment(assessment) {
    return this.http.post(this.baseUrl + 'Assessment/CreateAssessment',
      assessment,
      this.authService.requestOptions()
    ).pipe(map((response: Response) => {
        return (response.ok) ? true : false;
      })
    );
  }

  saveEmployeeAssessment(empAssessment) {
    return this.http.post(this.baseUrl + 'EmployeeAssessment/InsertEmployeeAssessment',
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
    return this.http.put(this.baseUrl + 'Assessment/UpdateAssessment',
      assessment ,
      this.authService.requestOptions()
    ).pipe(map((response: Response) => {
        return (response.ok) ? true : false;
      })
    );
  }

}