import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IndigenousLand {

  urlRegion = environment.terramaUrl + '/api/indigenousLand';

  constructor(
    private http: HttpClient
  ) {}

  getAll() {
    return this.http.get(this.urlRegion + '/getAll').toPromise();
  }
}
