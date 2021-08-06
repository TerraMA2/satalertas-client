import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { Layer } from '../models/layer.model';

import { FilterParam } from '../models/filter-param.model';

import { environment } from '../../environments/environment';

import { HTTPService } from './http.service';
import { FilterAlertType } from '../models/filter-alert-type.model';
import { FilterTheme } from '../models/filter-theme.model';
import { FilterAuthorization } from '../models/filter-authorization.model';
import { FilterSpecificSearch } from '../models/filter-specific-search.model';
import { FilterClass } from '../models/filter-class.model';

@Injectable({
	providedIn: 'root'
})
export class FilterService {
	urlBiome = environment.reportServerUrl + '/biome';
	urlCity = environment.reportServerUrl + '/city';
	urlConservationUnit = environment.reportServerUrl + '/conservationUnit';
	urlIndigenousLand = environment.reportServerUrl + '/indigenousLand';
	urlProjus = environment.reportServerUrl + '/projus';
	urlAnalyze = environment.reportServerUrl + '/analyze';

	filterMap = new Subject<boolean>();
	filterTable = new Subject();
	filterDashboard = new Subject();
	changeAlertType = new Subject<FilterAlertType>()
	changeTheme = new Subject<FilterTheme>()
	changeAuthorization = new Subject<FilterAuthorization>()
	changeSpecificSearch = new Subject<FilterSpecificSearch>()
	changeClass = new Subject<FilterClass>()

	displayFilter = new Subject();

	filterSynthesis = new Subject<Layer>();

	constructor(
		private httpService: HTTPService
	) {
	}

	getParams(value) {
		const date = JSON.parse(localStorage.getItem('dateFilter'));

		const specificParameters = JSON.stringify(value);
		const filterParam = JSON.parse(localStorage.getItem('filterState'));

		const filterNew = new FilterParam(
			(filterParam && filterParam.themeSelected ? filterParam.themeSelected : { value: 'ALL' }),
			(filterParam && filterParam.alertType ? filterParam.alertType : { radioValue: 'ALL', analyses: [] }),
			(filterParam && filterParam.autorization ? filterParam.autorization : { name: 'Todos', value: 'ALL' }),
			(filterParam && filterParam.specificSearch ? filterParam.specificSearch : {
				isChecked: false,
				CarCPF: 'CAR'
			}),
			(filterParam && filterParam.classSearch ? filterParam.classSearch : { radioValue: 'ALL', analyses: [] })
		);
		if (filterNew.specificSearch.isChecked && filterNew.specificSearch.CarCPF === 'CPF') {
			filterNew.specificSearch.inputValue = filterNew.specificSearch.inputValue ? filterNew.specificSearch.inputValue.replace(/\D/g, '') : null;
		}
		const filter = JSON.stringify(filterNew);
		return { specificParameters, date, filter };
	}

	getAllBiomes() {
		return this.httpService.get<any>(this.urlBiome).toPromise();
	}

	getAllCities() {
		return this.httpService.get<any>(this.urlCity).toPromise();
	}

	getAllRegions() {
		return this.httpService.get<any>(this.urlCity + '/getAllRegions').toPromise();
	}

	getAllMesoregions() {
		return this.httpService.get<any>(this.urlCity + '/getAllMesoregions').toPromise();
	}

	getAllImmediateRegion() {
		return this.httpService.get<any>(this.urlCity + '/getAllImmediateRegion').toPromise();
	}

	getAllIntermediateRegion() {
		return this.httpService.get<any>(this.urlCity + '/getAllIntermediateRegion').toPromise();
	}

	getAllPjbh() {
		return this.httpService.get<any>(this.urlCity + '/getAllPjbh').toPromise();
	}

	getAllMicroregions() {
		return this.httpService.get<any>(this.urlCity + '/getAllMicroregions').toPromise();
	}

	getAllConservationUnit() {
		return this.httpService.get<any>(this.urlConservationUnit).toPromise();
	}

	getAllIndigenousLand() {
		return this.httpService.get<any>(this.urlIndigenousLand).toPromise();
	}

	getAllProjus() {
		return this.httpService.get<any>(this.urlProjus).toPromise();
	}

	async getAllClassByType(type) {
		const url = `${ this.urlAnalyze }/getAllClassByType`;
		const params = {
			params: {
				type: type ? type : ''
			}
		};
		return await this.httpService.get<any>(url, params).toPromise();
	}
}
