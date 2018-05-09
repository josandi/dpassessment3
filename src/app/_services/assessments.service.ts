import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { query } from '@angular/animations';

export interface AssessmentData {
  "assessment_id": number,
  "assessment_name": string,
  "description": string,
  "questions_count": number,
  "date_created": string,
  "deadline": string,
  "date_submitted": string,
  "status": string
}

@Injectable({
  providedIn: 'root'
})
export class AssessmentsService {
  private _url: string = "/assets/test-data";

  constructor(private http: HttpClient) { }

  getAllAssessments() {
    return this.http.get<Array<AssessmentData>>(this._url + '/user-assessment-list.json'/*, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token)
    }*/);
  }


  // utilities

  getEmpAssessmentStatus(assessmentId) {
    return this.http.get<Array<AssessmentData>>(this._url + '/employee-assessment-stat.json'/*, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token)
    }*/);
  }

  getEmpAssessmentQuestionnaire(empId, assessmentId) {
    return this.http.get<Array<AssessmentData>>(this._url + '/assessment-questionnaire.json'/*, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token)
    }*/);
  }

  getQuestionnairesList()  {
    return this.http.get<Array<AssessmentData>>(this._url + 'questionnaire-list.json'/*, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token)
    }*/);
  }

  getQuestionnaire(questionnaireId) {
    return this.http.get<Array<AssessmentData>>(this._url + 'assessment-questionnaire.json'/*, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token)
    }*/);
  }

  getAllQuestionCategories() {
    return this.http.get<Array<AssessmentData>>(this._url + 'categories-list.json'/*, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token)
    }*/);
  }

  getOptionGroups() {
    return this.http.get<Array<AssessmentData>>(this._url + 'option-groups-list.json'/*, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token)
    }*/);
  }

  getQuestionnaireCategories(questions) {
      var categories = [];

      var unique = {};
      for( var i in questions ){
          var qst = questions[i];

          if( typeof(unique[qst.category_id]) == "undefined" ){
              categories
                  .push({
                      'category_id': qst.category_id,
                      'category_name': qst.category_name
                  });
          }
          unique[qst.category_id] = 0;
      }
      
      return categories;
  }
}