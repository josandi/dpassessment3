import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { PaginatedResult } from '../_models/pagination';
import { Team } from '../_models/team';
import { AuthHttp } from 'angular2-jwt';
import { API_X } from '../_config/constants.config';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private baseUrl: string = API_X.END_POINT;

  constructor(private authHttp: AuthHttp) { }

  // API GET 

  /* Purpose: get list of all teams */
  getAllTeams(page?: number, itemsPerPage?: number) {
    console.log('service getAllTeams');
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
        console.log(paginatedResult);
        return paginatedResult;
      })
    );
  }
}
