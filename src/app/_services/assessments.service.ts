import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssessmentsService {
  private baseUrl: string = "/assets/test-data/";

  constructor(private http: Http,
              private authService: AuthService) { }

  // api get

  getAllAssessments() {
    return this.http.get(this.baseUrl + 'user-assessment-list.json', this.authService.requestOptions())
      .pipe(map((response: Response) => {
        return response.json().data;  
      })
    );
  }

  getQuestionnairesList() {
    return this.http.get(this.baseUrl + 'questionnaire-list.json', this.authService.requestOptions())
      .pipe(map((response: Response) => {
        return response.json().data;  
      })
    );
  }

  EmpAssessmentStatus() {
    return this.http.get(this.baseUrl + 'employee-assessment-stat.json', this.authService.requestOptions())
      .pipe(map((response: Response) => {
        return response.json().data;  
      })
    );
  }

}