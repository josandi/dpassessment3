import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { API } from '../_config/constants.config';
import { AuthHttp } from 'angular2-jwt';
import { ErrorService } from './error.service';
import { PaginatedResult } from '../_models/pagination';
import { Questionnaire } from '../_models/questionnaire';

@Injectable({
  providedIn: 'root'
})
export class QuestionnairesService {

  private baseUrl: string = API.END_POINT;

  constructor(private authHttp: AuthHttp,
              private err: ErrorService) { }

  // API GET
  /* Purpose: get all questionnaires */
  getAllQuestionnaires(page?: number, itemsPerPage?: number) {
    const paginatedResult: PaginatedResult<Questionnaire[]> = new PaginatedResult<Questionnaire[]>();
    let queryStr = '?';
    if(page != null && itemsPerPage != null) {
      queryStr += 'PageNumber=' + page + '&PageSize=' + itemsPerPage;
    }

    return this.authHttp.get(
        this.baseUrl + API.QUESTIONNAIRE.GET_ALL + queryStr
      ).pipe(map((response: Response) => {
        paginatedResult.result = response.json();
        if(response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

  /* Purpose: get specific questionnaire */
  getQuestionnaireDetail(questionnaireId) {
    return this.authHttp.get(
        this.baseUrl + API.QUESTIONNAIRE.GET_ONE + questionnaireId
      ).pipe(map((response: Response) => {
        return response.json();
      })
    );
  }

  /* Purpose: get set of questions with corresponding options of a specific questionnaire */
  getQuestionnaire(questionnaireId) {
    return this.authHttp.get(
        this.baseUrl + API.QUESTIONNAIRE.GET_QUESTIONS + questionnaireId
      ).pipe(map((response: Response) => {
        return response.json().data;
      })
    );
  }

  /* Purpose: get all question categories */
  getQuestionCategories() {
    return this.authHttp.get(
        this.baseUrl + API.QUESTION_CATEGORY.GET_ALL
      ).pipe(map((response: Response) => {
          return response.json();
        })
      );
  }

  /* Purpose: get all option groups */
  getQuestionOptGroups() {
    return this.authHttp.get(
        this.baseUrl + API.OPTION_GROUP.GET_ALL
      ).pipe(map((response: Response) => {
        return response.json();
      })
    );
  }

  /* Purpose: get all option groups with corresponding options */
  getGroupedOptions() {
    return this.authHttp.get(
        this.baseUrl + API.OPTION_GROUP.GET_ALL_WITH_OPTIONS
      ).pipe(map((response: Response) => {
        return response.json();
      })
    );
  }

  // API POST
  /* Purpose: save new questionnaire; returns questionnaire id so it will be used to save questions under it */
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

  /* Purpose: save array of questions */
  saveQuestions(questionsArr) {
    return this.authHttp.post(
        this.baseUrl + API.QUESTION.INSERT_ARR,
        questionsArr
      ).pipe(map((response: Response) => {
        return (response.ok) ? true : false;
      }), catchError(this.err.handleAPIError));
  }

  // API PUT
  /* Purpose: update questionnaire detail */
  updateQuestionnaire(questionnaire) {
    return this.authHttp.put(
      this.baseUrl + API.QUESTIONNAIRE.UPDATE,
      questionnaire
    ).pipe(map((response: Response) => {
      return (response.ok) ? true : false;
    }), catchError(this.err.handleAPIError));
  }

  // API DELETE
  /* Purpose: delete a specific question; used in edit operation of questionnaire */
  deleteQuestion(questionId) {
    return this.authHttp.delete(
        this.baseUrl + API.QUESTION.REMOVE + '/?id=' + questionId
      ).pipe(map((response: Response) => {
        return (response.ok) ? true : false;
      })
    );
  }

  // UTILITIES
  /* Purpose: finds specific category in categories array */
  findCategoryInArr(categories, categoryId) {
    return categories.find(x => x.questionCategoryId == categoryId);
  }

  /* Purpose: retrieves all unique categories from a set of questions */
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