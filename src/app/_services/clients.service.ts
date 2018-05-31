import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { API } from '../_config/constants.config';
import { PaginatedResult } from '../_models/pagination';
import { Client } from '../_models/client';
import { environment } from '../../environments/environment';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private baseUrl: string = environment.apiUrl;

  constructor(private authHttp: AuthHttp,
              private error: ErrorService) { }

  // API GET

  /* Purpose: get all clients */
  getAllClients(page?: number, itemsPerPage?: number) {
    const paginatedResult: PaginatedResult<Client[]> = new PaginatedResult<Client[]>();
    let queryStr = '?';
    if(page != null && itemsPerPage != null) {
      queryStr += 'PageNumber=' + page + '&PageSize=' + itemsPerPage;
    }

    return this.authHttp.get(
        this.baseUrl + API.CLIENT.GET_ALL + queryStr
      ).pipe( map((response: Response) => {
        paginatedResult.result = response.json();
        if(response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

  /* Purpose: get list of clients for dropdown */
  getClientsList() {
    return this.authHttp.get(
        this.baseUrl + API.CLIENT.GET_LIST
      ).pipe(map((response: Response) => {
        return response.json();
      }), catchError( err => this.error.handleAPIError(err) ));
  }
}
