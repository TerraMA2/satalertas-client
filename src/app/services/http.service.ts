import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';

import { catchError, retry } from 'rxjs/operators';

import { environment,  } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HTTPService {

  constructor(
    private http: HttpClient
  ) {}

  get(url, parameters = {}) {
    if (!url) {
      return;
    }
    const baseUrl = environment.baseUrl;
    const baseUrlProd = 'http://www.terrama2.dpi.inpe.br/mpmt';
    if (!url.includes(baseUrl) && !url.includes(baseUrlProd)) {
      url = baseUrl + url;
    }
    return this.http.get<any[]>(url, {
      params: parameters
    }).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  post(url, parameters = {}) {
    if (!url) {
      return;
    }
    const baseUrl = environment.baseUrl;
    if (!url.includes(baseUrl)) {
      url = baseUrl + url;
    }
    return this.http.post<any[]>(url, {
      params: parameters
    }).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(`Error occured: ${error.message}`);
  }

}