import { Injectable } from '@angular/core';

import { lastValueFrom, Subject } from 'rxjs';

import { FilterParam } from '../models/filter-param.model';

import { environment } from '../../environments/environment';

import { HTTPService } from './http.service';

import { FilterAlertType } from '../models/filter-alert-type.model';

import { FilterTheme } from '../models/filter-theme.model';

import { FilterAuthorization } from '../models/filter-authorization.model';

import { FilterSpecificSearch } from '../models/filter-specific-search.model';

import { FilterClass } from '../models/filter-class.model';

import { Response } from '../models/response.model';

import { FormBuilder } from '@angular/forms';

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
	filterTable = new Subject<void>();
	filterDashboard = new Subject<void>();
	changeAlertType = new Subject<FilterAlertType>()
	changeTheme = new Subject<FilterTheme>()
	changeAuthorization = new Subject<FilterAuthorization>()
	changeSpecificSearch = new Subject<FilterSpecificSearch>()
	changeClass = new Subject<FilterClass>()

	displayFilter = new Subject<void>();

	filterSynthesis = new Subject<void>();

	constructor(
		private httpService: HTTPService,
		private formBuilder: FormBuilder
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
		return lastValueFrom(this.httpService.get<Response>(this.biomeUrl));
	}

	getCities() {
		return lastValueFrom(this.httpService.get<Response>(this.cityUrl));
	}

	getRegions() {
		return lastValueFrom(this.httpService.get<Response>(this.cityUrl + '/getRegions'));
	}

	getMesoregions() {
		return lastValueFrom(this.httpService.get<Response>(this.cityUrl + '/getMesoregions'));
	}

	getImmediateRegion() {
		return lastValueFrom(this.httpService.get<Response>(this.cityUrl + '/getImmediateRegion'));
	}

	getIntermediateRegion() {
		return lastValueFrom(this.httpService.get<Response>(this.cityUrl + '/getIntermediateRegion'));
	}

	getPjbh() {
		return lastValueFrom(this.httpService.get<Response>(this.cityUrl + '/getPjbh'));
	}

	getMicroregions() {
		return lastValueFrom(this.httpService.get<Response>(this.cityUrl + '/getMicroregions'));
	}

	getConservationUnit() {
		return lastValueFrom(this.httpService.get<Response>(this.conservationUnitUrl));
	}

	getIndigenousLand() {
		return lastValueFrom(this.httpService.get<Response>(this.indigenousLandUrl));
	}

	getProjus() {
		return lastValueFrom(this.httpService.get<Response>(this.projusUrl));
	}

	getClasses(type) {
		const url = `${ this.classUrl }`;
		const params = {
			params: {
				type: type ? type : ''
			}
		};
		return lastValueFrom(this.httpService.get<Response>(url, params));
	}

	async getThemeValues(theme) {
		const url = `${environment.serverUrl}/filter/${theme}`;
		const response = await lastValueFrom(this.httpService.get<Response>(url));
		return response.data;
	}

	getFormGroup(isSearch = false) {
		return this.formBuilder.group({
			theme: this.formBuilder.group({
				description: ['all'],
				value: ['none']
			}),
			area: this.formBuilder.group({
				deter: [null],
				prodes: [null],
				fireSpot: [null],
				burnedArea: [null],
				property: [null],
				deterCustom: [null],
				prodesCustom: [null],
				fireSpotCustom: [null],
				burnedCustom: [null],
				propertyCustom: [null]
			}),
			class: this.formBuilder.group({
				deterValue: ['all'],
				prodesValue: ['all'],
				fireSpotValue: ['all'],
				burnedAreaValue: ['all']
			}),
			search: this.formBuilder.group({
				isSearch: [isSearch],
				description: ['stateCAR'],
				value: [null]
			})
		});
	}
}
