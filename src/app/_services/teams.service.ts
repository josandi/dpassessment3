import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { PaginatedResult } from '../_models/pagination';
import { Team } from '../_models/team';
import { AuthHttp } from 'angular2-jwt';
import { API, API_X } from '../_config/constants.config';
import { map, catchError } from 'rxjs/operators';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private baseUrl: string = API_X.END_POINT;

  constructor(private authHttp: AuthHttp,
              private error: ErrorService) { }

  // API GET 

  /* Purpose: get all teams */
  getAllTeams(page?: number, itemsPerPage?: number) {
    const paginatedResult: PaginatedResult<Team[]> = new PaginatedResult<Team[]>();
    let queryStr = '?';
    if(page != null && itemsPerPage != null) {
      queryStr += 'PageNumber=' + page + '&PageSize=' + itemsPerPage;
    }

    return this.authHttp.get(
        this.baseUrl + API_X.TEAM.GET_ALL + queryStr
      ).pipe(map( (response: Response) => {
        paginatedResult.result = response.json().data;
        if(response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

  /* Purpose: get list of teams for dropdown */
  getTeamsList() {
    return this.authHttp.get(
        this.baseUrl + API_X.TEAM.GET_LIST
      ).pipe(map((response: Response) => {
        return response.json().data;
      }), catchError(err => this.error.handleAPIError(err)));
  }
  
  /* Purpose: get clients list */
  getClientsList() {
    return this.authHttp.get(
        this.baseUrl + API_X.CLIENT.GET_LIST
      ).pipe(map((response: Response) => {
        return response.json().data;
      }), catchError(err => this.error.handleAPIError(err)));
  }

  /* Purpose: get employees list */
  getEmployeesList() {
    return this.authHttp.get(
        this.baseUrl + API_X.EMPLOYEE.GET_LIST
      ).pipe(map((response: Response) => {
        return response.json().data;
      }), catchError(err => this.error.handleAPIError(err)));
  }

  /* Purpose: get roles */
  getEmpRolesList() {
    return this.authHttp.get(
        this.baseUrl + API_X.ROLE.GET_LIST
      ).pipe(map((response: Response) => {
        return response.json().data;
      }), catchError(err => this.error.handleAPIError(err)));
  }

  /* Purpose: get team members */
  getTeamMembers(teamId) {
    return this.authHttp.get(
        this.baseUrl + API_X.TEAM.GET_MEMBERS
      ).pipe(map((response: Response) => {
        return response.json().data;
      }), catchError(err => this.error.handleAPIError(err)));
  }

  /* Purpose: get team members */
  getTeamAssessments(teamId) {
    return this.authHttp.get(
        this.baseUrl + API_X.TEAM.GET_ASSESSMENTS
      ).pipe(map((response: Response) => {
        return response.json().data;
      }), catchError(err => this.error.handleAPIError(err)));
  }

  /* Purpose: get projects list */
  getProjects() {
    return this.authHttp.get(
        API.END_POINT + API.TEAM.LIST_PROJECTS
      ).pipe(map((response: Response) => {
        return response.json();
      }), catchError(err => this.error.handleAPIError(err)));
  }

}
