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

}
