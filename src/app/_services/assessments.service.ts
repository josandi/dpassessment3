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

  getQuestionnairesList() {
    return this.http.get(this.baseUrl + 'Questionaire', this.authService.requestOptions())
      .pipe(map((response: Response) => {
        return response.json();  
      })
    );
  }

  /* Purpose: get all status of employees for the specific assessment */
  getEmpAssessmentStatus(assessmentId) {          // TEMPORARY: change endpoint once done
    return this.http.get(this.baseUrl + 'Employees', this.authService.requestOptions())
      .pipe(map((response: Response) => {
        return response.json();  
      })
    );
  }

  getEmpAssessmentQuestionnaire(employeeId, assessmentID, questionnaireId) {
    // TEMPORARY (do once endpoint is done):
    //    - remove questionnaireId param
    //    - update endpoint path (for now, get questionnaire w/o answers)
    return this.http.get(this.baseUrl + 'Questionaire/QuestionairesWithQuestions/' + questionnaireId, 
      this.authService.requestOptions())
        .pipe(map((response: Response) => {
          return response.json().data;
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

  // API DELETE

  deleteAssessment(assessment) {

  }

}