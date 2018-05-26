import { Injectable } from '@angular/core';
import { AlertifyService } from './alertify.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private alertify: AlertifyService) { }

  handleAPIError(error: any) {
    return throwError(error);
  }
}
