import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { AlertifyService } from "../_services/alertify.service";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import 'rxjs/add/observable/of'
import { Client } from "../_models/client";
import { ClientsService } from "../_services/clients.service";

@Injectable()
export class ClientsResolver implements Resolve<Client[]> {
  pageNumber = 1;
  pageSize = 10;

  constructor(private clientsService: ClientsService,
              private router: Router,
              private alertify: AlertifyService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Client[]> {
    return this.clientsService.getAllClients(this.pageNumber, this.pageSize)
              .pipe(catchError (err => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/dashboard']);
                return Observable.of(null);
              }));
  }
}