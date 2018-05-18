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

  // api get

  getAllQuestionnaires() {
    return this.http.get(this.baseUrl + 'Questionaire', this.authService.requestOptions())
      .pipe(map((response: Response) => {
        return response.json();
      })
    );
  }

  getQuestionnaire(questionnaireId) {
    return this.http.get(this.baseUrl + 'Questionaire/QuestionairesWithQuestions/' + questionnaireId, 
      this.authService.requestOptions())
        .pipe(map((response: Response) => {
          return response.json().data;
        })
    );
  }

  getQuestions(questionnaireId) {
    return this.http.get('/assets/test-data/questions.json', this.authService.requestOptions())
      .pipe(map((response: Response) => {
        return response.json().data;
      })
    );
  }

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

  getGroupedOptions() {
    return this.http.get('/assets/test-data/option-groups.json', this.authService.requestOptions())
      .pipe(map((response: Response) => {
        return response.json().data;
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

  // utilities

  findCategoryInArr(categories, categoryId) {
    return categories.find(x => x.questionCategoryId == categoryId);
  }

  getCategoriesFromQuestionsArr(questions) {
    let categories: any = [];

    questions.forEach(question => {
      if(!this.findCategoryInArr(categories, question.questionCategoryId)) {
        categories.push({
          'questionCategoryId': question.questionCategoryId,
          'questionCategoryDesc': question.questionCategoryDesc
        });
      }
    });

    return categories;
  }

}
