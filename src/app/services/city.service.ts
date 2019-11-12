import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  urlCity = environment.terramaUrl + '/api/city';

  constructor(
    private http: HttpClient
  ) {}

  getAll() {
    return this.http.get(this.urlCity + '/getAll').toPromise();
  }

  getAllRegions() {
    return this.http.get(this.urlCity + '/getAllRegions').toPromise();
  }

  getAllMesoregions() {
    return this.http.get(this.urlCity + '/getAllMesoregions').toPromise();
  }

  getAllMicroregions() {
    return this.http.get(this.urlCity + '/getAllMicroregions').toPromise();
  }
}
