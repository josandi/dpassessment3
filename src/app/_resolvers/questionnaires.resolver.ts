import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Questionnaire } from "../_models/questionnaire";
import { QuestionnairesService } from "../_services/questionnaires.service";
import { AlertifyService } from "../_services/alertify.service";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import 'rxjs/add/observable/of'

@Injectable()
export class QuestionnairesResolver implements Resolve<Questionnaire[]> {
  pageNumber = 1;
  pageSize = 10;

  constructor(private questionnairesService: QuestionnairesService,
              private router: Router,
              private alertify: AlertifyService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Questionnaire[]> {
    return this.questionnairesService.getAllQuestionnaires(this.pageNumber, this.pageSize)
              .pipe(catchError (err => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['dashboard']);
                return Observable.of(null);
              }));
  }
}