import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { API } from '../_config/constants.config';
import { AuthHttp } from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class QuestionnairesService {

  private baseUrl: string = API.END_POINT;

  constructor(private authHttp: AuthHttp) { }

  // API GET

  getAllQuestionnaires() {
    return this.authHttp.get(
        this.baseUrl + API.QUESTIONNAIRE.GET_ALL
      ).pipe(map((response: Response) => {
          return response.json();
        })
      );
  }

  getQuestionnaire(questionnaireId) {
    return this.authHttp.get(
        this.baseUrl + API.QUESTIONNAIRE.GET_QUESTIONS + questionnaireId
      ).pipe(map((response: Response) => {
        return response.json().data;
      })
    );
  }

  getQuestionnaireDetail(questionnaireId) {
    return this.authHttp.get(
        this.baseUrl + API.QUESTIONNAIRE.GET_ONE + questionnaireId
      ).pipe(map((response: Response) => {
        return response.json();
      })
    );
  }

  getQuestionCategories() {
    return this.authHttp.get(
        this.baseUrl + API.QUESTION_CATEGORY.GET_ALL
      ).pipe(map((response: Response) => {
          return response.json();
        })
      );
  }

  getQuestionOptGroups() {
    return this.authHttp.get(
        this.baseUrl + API.OPTION_GROUP.GET_ALL
      ).pipe(map((response: Response) => {
        return response.json();
      })
    );
  }

  getGroupedOptions() {
    return this.authHttp.get(
        this.baseUrl + API.OPTION_GROUP.GET_ALL_WITH_OPTIONS
      ).pipe(map((response: Response) => {
        return response.json();
      })
    );
  }

  // API POST

  saveQuestionnaire(questionnaire) {
    return this.authHttp.post(
        this.baseUrl + API.QUESTIONNAIRE.CREATE,
        questionnaire
      ).pipe(map((response: Response) => {
          const returnedQuestionnaire = response.json();
          if(returnedQuestionnaire) {
            return returnedQuestionnaire.questionaireId;
          }
        })
      );
  }

  saveQuestions(questionsArr) {
    return this.authHttp.post(
        this.baseUrl + API.QUESTION.INSERT_ARR,
        questionsArr
      ).pipe(map((response: Response) => {
          return (response.ok) ? true : false;
        })
      );
  }

  // API PUT

  updateQuestionnaire(questionnaire) {
    return this.authHttp.put(
      this.baseUrl + API.QUESTIONNAIRE.UPDATE,
      questionnaire
    ).pipe(map((response: Response) => {
        return (response.ok) ? true : false;
      })
    );
  }

  // API DELETE

  deleteQuestion(questionId) {
    return this.authHttp.delete(
        this.baseUrl + API.QUESTION.REMOVE + '/?id=' + questionId
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
