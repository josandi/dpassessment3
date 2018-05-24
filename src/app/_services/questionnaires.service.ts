import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { API } from '../_config/constants.config';

@Injectable({
  providedIn: 'root'
})
export class QuestionnairesService {

  private baseUrl: string = API.END_POINT;

  constructor(private http: Http,
              private authService: AuthService) { }

  // API GET

  getAllQuestionnaires() {
    return this.http.get(
        this.baseUrl + API.QUESTIONNAIRE.GET_ALL, 
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
          return response.json();
        })
      );
  }

  getQuestionnaire(questionnaireId) {
    return this.http.get(
        this.baseUrl + API.QUESTIONNAIRE.GET_QUESTIONS + questionnaireId, 
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
        return response.json().data;
      })
    );
  }

  getQuestionnaireDetail(questionnaireId) {
    return this.http.get(
        this.baseUrl + API.QUESTIONNAIRE.GET_ONE + questionnaireId, 
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
        return response.json();
      })
    );
  }

  getQuestionCategories() {
    return this.http.get(
        this.baseUrl + API.QUESTION_CATEGORY.GET_ALL, 
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
          return response.json();
        })
      );
  }

  getQuestionOptGroups() {
    return this.http.get(
        this.baseUrl + API.OPTION_GROUP.GET_ALL, 
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
        return response.json();
      })
    );
  }

  getGroupedOptions() {
    return this.http.get(
        this.baseUrl + API.OPTION_GROUP.GET_ALL_WITH_OPTIONS, 
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
        return response.json();
      })
    );
  }

  // API POST

  saveQuestionnaire(questionnaire) {
    return this.http.post(
        this.baseUrl + API.QUESTIONNAIRE.CREATE,
        questionnaire,
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
          const returnedQuestionnaire = response.json();
          if(returnedQuestionnaire) {
            return returnedQuestionnaire.questionaireId;
          }
        })
      );
  }

  saveQuestions(questionsArr) {
    return this.http.post(
        this.baseUrl + API.QUESTION.INSERT_ARR,
        questionsArr,
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
          return (response.ok) ? true : false;
        })
      );
  }

  // API PUT

  updateQuestionnaire(questionnaire) {
    return this.http.put(
      this.baseUrl + API.QUESTIONNAIRE.UPDATE,
      questionnaire,
      this.authService.requestOptions()
    ).pipe(map((response: Response) => {
        return (response.ok) ? true : false;
      })
    );
  }

  // API DELETE

  deleteQuestion(questionId) {
    return this.http.delete(
        this.baseUrl + API.QUESTION.REMOVE + '/?id=' + questionId,
        this.authService.requestOptions()
      ).pipe(map((response: Response) => {
        return (response.ok) ? true : false;
      })
    );
  }

  // UTILITIES

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
