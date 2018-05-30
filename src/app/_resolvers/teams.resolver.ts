import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Team } from "../_models/team";
import { AlertifyService } from "../_services/alertify.service";
import { TeamsService } from "../_services/teams.service";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import 'rxjs/add/observable/of'

@Injectable()
export class TeamsResolver implements Resolve<Team[]> {
  pageNumber = 1;
  pageSize = 10;

  constructor(private teamsService: TeamsService,
              private router: Router,
              private alertify: AlertifyService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Team[]> {
    return this.teamsService.getAllTeams(this.pageNumber, this.pageSize)
              .pipe(catchError (err => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/dashboard']);
                return Observable.of(null);
              }));
  }
}