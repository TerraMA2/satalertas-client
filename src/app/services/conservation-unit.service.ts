import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConservationUnitService  {


  urlRegion = environment.terramaUrl + '/api/conservationUnit';

  constructor(
    private http: HttpClient
  ) {}

  getAll() {
    return this.http.get(this.urlRegion + '/getAll').toPromise();
  }
}
