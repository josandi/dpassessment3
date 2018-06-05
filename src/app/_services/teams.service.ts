import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { PaginatedResult } from '../_models/pagination';
import { Team } from '../_models/team';
import { AuthHttp } from 'angular2-jwt';
import { API, API_X } from '../_config/constants.config';
import { map, catchError } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private baseUrl_X: string = API_X.END_POINT;
  private baseUrl: string = environment.apiUrl;

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
        this.baseUrl + API.PROJECT_TEAM.GET_ALL_TEAMS + queryStr
      ).pipe(map( (response: Response) => {
        paginatedResult.result = response.json();
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
        this.baseUrl + API.PROJECT_TEAM.GET_ALL_TEAMS
      ).pipe(map((response: Response) => {
        return response.json();
      }), catchError(err => this.error.handleAPIError(err)));
  }

  /* Purpose: get employees list */
  getEmployeesList() {
    return this.authHttp.get(
        this.baseUrl_X + API_X.EMPLOYEE.GET_LIST
      ).pipe(map((response: Response) => {
        return response.json().data;
      }), catchError(err => this.error.handleAPIError(err)));
  }

  /* Purpose: get list of employee roles */
  getEmpRoleList() {
    return this.authHttp.get(
      this.baseUrl + API.PROJECT_TEAM.LIST_ROLES
    ).pipe(map((response: Response) => {
      return response.json();
    }), catchError(err => this.error.handleAPIError(err)));
  }

  /* Purpose: get team members */
  getTeamMembers(teamId) {
    return this.authHttp.get(
        this.baseUrl + API.PROJECT_TEAM.GET_TEAM_MEMBERS + teamId
      ).pipe(map((response: Response) => {
        return response.json();
      }), catchError(err => this.error.handleAPIError(err)));
  }

  /* Purpose: get team members */
  getTeamAssessments(teamId) {
    return this.authHttp.get(
        this.baseUrl_X + API_X.TEAM.GET_ASSESSMENTS
      ).pipe(map((response: Response) => {
        return response.json().data;
      }), catchError(err => this.error.handleAPIError(err)));
  }

  /* Purpose: get projects list */
  getProjects() {
    return this.authHttp.get(
        this.baseUrl + API.PROJECT_TEAM.LIST_PROJECTS
      ).pipe(map((response: Response) => {
        return response.json();
      }), catchError(err => this.error.handleAPIError(err)));
  }

  // API POST

  /* Purpose: save new team; uses different endpoints for new project and for existing projects  */
  saveNewTeam(team, isNewProject: boolean) {
    let endpoint = (isNewProject) ? API.PROJECT_TEAM.CREATE_W_NEWPROJ : 
                                    API.PROJECT_TEAM.CREATE_W_EXISTINGPROJ;
    
    return this.authHttp.post(
        this.baseUrl + endpoint,
        team
      ).pipe(map((response: Response) => {
        return (response.ok) ? true : false;
      }), catchError( err => this.error.handleAPIError(err)));
  }

  // API PUT

  /* Purpose: update specific team */
  updateTeam(team) {
    return this.authHttp.put(
        this.baseUrl + API.PROJECT_TEAM.UPDATE,
        team
      ).pipe(map((response: Response) => {
        return (response.ok) ? true : false;
      }), catchError( err => this.error.handleAPIError(err)));
  }

}
