import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { Layer } from '../models/layer.model';
import {Alert} from '../models/alert.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  urlDashboard = environment.reportServerUrl + '/dashboard';

  filterMap = new Subject();
  filterTable = new Subject();
  filterDashboard = new Subject();

  displayFilter = new Subject();

  filterReport = new Subject<Layer>();

  getParams(value) {
    const date = JSON.parse(localStorage.getItem('dateFilter'));

    const specificParameters = JSON.stringify(value);
    const filter = localStorage.getItem('filterList');
    return {specificParameters, date, filter};
  }

  constructor(
    private http: HttpClient
  ) { }


  async getAnalysisTotals( alerts: Alert [] = [] ) {

    const url = this.urlDashboard + '/getAnalysisTotals';

    const parameters = this.getParams(alerts);

    return await this.http.get(url, { params: parameters }).toPromise();
  }

  async getDetailsAnalysisTotals( alerts: Alert [] = [] ) {
    const url = this.urlDashboard + '/getDetailsAnalysisTotals';

    const parameters = this.getParams(alerts);

    return await this.http.get(url, { params: parameters }).toPromise();
  }
}
