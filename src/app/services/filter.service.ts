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

import { Response } from '../models/response.model';

@Injectable({
	providedIn: 'root'
})
export class FilterService {
	biomeUrl = environment.serverUrl + '/biome';
	cityUrl = environment.serverUrl + '/city';
	conservationUnitUrl = environment.serverUrl + '/conservationUnit';
	indigenousLandUrl = environment.serverUrl + '/indigenousLand';
	projusUrl = environment.serverUrl + '/projus';
	classUrl = environment.serverUrl + '/class';

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

	getParams(value= {}) {
		const date = JSON.parse(localStorage.getItem('dateFilter'));

		const specificParameters = JSON.stringify(value);
		const filterParam = JSON.parse(localStorage.getItem('filterState'));

		const filterNew = new FilterParam(
			(filterParam && filterParam.themeSelected ? filterParam.themeSelected : { value: 'ALL' }),
			(filterParam && filterParam.alertType ? filterParam.alertType : { radioValue: 'ALL', analyses: [] }),
			(filterParam && filterParam.authorization ? filterParam.authorization : { name: 'Todos', value: 'ALL' }),
			(filterParam && filterParam.specificSearch ? filterParam.specificSearch : {
				isChecked: false,
				carCPF: 'CAR'
			}),
			(filterParam && filterParam.classSearch ? filterParam.classSearch : { radioValue: 'ALL', analyses: [] })
		);
		if (filterNew.specificSearch.isChecked && filterNew.specificSearch.carCPF === 'CPF') {
			filterNew.specificSearch.inputValue = filterNew.specificSearch.inputValue ? filterNew.specificSearch.inputValue.replace(/\D/g, '') : null;
		}
		const filter = JSON.stringify(filterNew);
		return { specificParameters, date, filter };
	}

	getBiomes() {
		return this.httpService.get<Response>(this.biomeUrl).toPromise();
	}

	getCities() {
		return this.httpService.get<Response>(this.cityUrl).toPromise();
	}

	getRegions() {
		return this.httpService.get<Response>(this.cityUrl + '/getRegions').toPromise();
	}

	getMesoregions() {
		return this.httpService.get<Response>(this.cityUrl + '/getMesoregions').toPromise();
	}

	getImmediateRegion() {
		return this.httpService.get<Response>(this.cityUrl + '/getImmediateRegion').toPromise();
	}

	getIntermediateRegion() {
		return this.httpService.get<Response>(this.cityUrl + '/getIntermediateRegion').toPromise();
	}

	getPjbh() {
		return this.httpService.get<Response>(this.cityUrl + '/getPjbh').toPromise();
	}

	getMicroregions() {
		return this.httpService.get<Response>(this.cityUrl + '/getMicroregions').toPromise();
	}

	getConservationUnit() {
		return this.httpService.get<Response>(this.conservationUnitUrl).toPromise();
	}

	getIndigenousLand() {
		return this.httpService.get<Response>(this.indigenousLandUrl).toPromise();
	}

	getProjus() {
		return this.httpService.get<Response>(this.projusUrl).toPromise();
	}

	async getClasses(type) {
		const url = `${ this.classUrl }`;
		const params = {
			params: {
				type: type ? type : ''
			}
		};
		return await this.httpService.get<Response>(url, params).toPromise();
	}
}
