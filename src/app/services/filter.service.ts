import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';

import {Layer} from '../models/layer.model';

import {Alert} from '../models/alert.model';

import {environment} from '../../environments/environment';

import {FilterParam} from '../models/filter-param.model';
import {HTTPService} from './http.service';

@Injectable({
    providedIn: 'root'
})
export class FilterService {

    urlDashboard = environment.reportServerUrl + '/dashboard';

    filterMap = new Subject<boolean>();
    filterTable = new Subject();
    filterDashboard = new Subject();

    displayFilter = new Subject();

    filterSynthesis = new Subject<Layer>();

    constructor(
        private httpService: HTTPService
    ) {
    }

    getParams(value) {
        const date = JSON.parse(localStorage.getItem('dateFilter'));

        const specificParameters = JSON.stringify(value);
        const filterParam = JSON.parse(localStorage.getItem('filterList'));

        const filterNew = new FilterParam(
            (filterParam && filterParam.themeSelected ? filterParam.themeSelected : {value: 'ALL'}),
            (filterParam && filterParam.alertType ? filterParam.alertType : {radioValue: 'ALL', analyses: []}),
            (filterParam && filterParam.autorization ? filterParam.autorization : {name: 'Todos', value: 'ALL'}),
            (filterParam && filterParam.specificSearch ? filterParam.specificSearch : {
                isChecked: false,
                CarCPF: 'CAR'
            }),
            (filterParam && filterParam.classSearch ? filterParam.classSearch : {radioValue: 'ALL', analyses: []})
        );
        if (filterNew.specificSearch.isChecked && filterNew.specificSearch.CarCPF === 'CPF') {
            filterNew.specificSearch.inputValue = filterNew.specificSearch.inputValue ? filterNew.specificSearch.inputValue.replace(/\D/g, '') : null;
        }
        const filter = JSON.stringify(filterNew);
        return {specificParameters, date, filter};
    }

    async getAnalysisTotals(alerts: Alert [] = []) {

        const url = this.urlDashboard + '/getAnalysisTotals';

        const parameters = this.getParams(alerts);
        const params = {
            params: parameters
        };

        return await this.httpService.get<any>(url, params).toPromise();
    }

    async getDetailsAnalysisTotals(alerts: Alert [] = []) {
        const url = this.urlDashboard + '/getDetailsAnalysisTotals';

        const parameters = this.getParams(alerts);
        const params = {
            params: parameters
        };

        return await this.httpService.get<any>(url, params).toPromise();
    }
}
