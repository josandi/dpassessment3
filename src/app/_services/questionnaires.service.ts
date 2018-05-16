import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionnairesService {

  private baseUrl: string = 'http://13.75.89.123:881/api/';

  constructor(private http: Http,
              private authService: AuthService) { }

  // main functions

  getAllQuestionnaires() {
    return this.http.get(this.baseUrl + 'Questionaire', this.authService.requestOptions())
      .pipe(map((response: Response) => {
        return response.json();
      })
    );
  }

  // utilities

  getQuestionCategories() {
    return this.http.get(this.baseUrl + 'QuestionCategories', this.authService.requestOptions())
      .pipe(map((response: Response) => {
        return response.json();
      })
    );
  }

  getQuestionOptGroups() {
    return this.http.get(this.baseUrl + 'OptionGroups', this.authService.requestOptions())
      .pipe(map((response: Response) => {
        return response.json();
      })
    );
  }

  getOptionsList() {
    return this.http.get('/assets/test-data/options-list.json', this.authService.requestOptions())
      .pipe(map((response: Response) => {
        return response.json().data;
      })
    );
  }

}
