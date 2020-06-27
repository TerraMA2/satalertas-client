import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { Layer } from '../models/layer.model';
import {Alert} from '../models/alert.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {FilterTheme} from "../models/filter-theme.model";
import {FilterAlertType} from "../models/filter-alert-type.model";
import {FilterAuthorization} from "../models/filter-authorization.model";
import {FilterSpecificSearch} from "../models/filter-specific-search.model";
import {FilterClass} from "../models/filter-class.model";
import {FilterParam} from "../models/filter-param.model";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  urlDashboard = environment.reportServerUrl + '/dashboard';

  filterMap = new Subject<boolean>();
  filterTable = new Subject();
  filterDashboard = new Subject();

  displayFilter = new Subject();

  filterReport = new Subject<Layer>();

  getParams(value) {
    const date = JSON.parse(localStorage.getItem('dateFilter'));
    const specificParameters = JSON.stringify(value);
    const filterParam = JSON.parse(localStorage.getItem('filterList'));

    // @ts-ignore
    const filterNew = new FilterParam(
      (filterParam.themeSelected ? filterParam.themeSelected : null),
      (filterParam.alertType ? filterParam.alertType : null),
      (filterParam.autorization ? filterParam.autorization : null),
      (filterParam.specificSearch ? filterParam.specificSearch : null),
      (filterParam.classSearch ? filterParam.classSearch : {
        radioValue: 'SELECTION',
        analyzes: [{
          label: 'Classes do Deter',
          type: 'deter',
          valueOption: 'DESMATAMENTO_CR',
          options: []
        }]
      })
    );

    const filter = JSON.stringify(filterNew);
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
