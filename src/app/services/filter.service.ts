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
import { CountyService } from './county.service';
import { FormControl, FormGroup } from '@angular/forms';

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
	countyUrl = environment.serverUrl + '/county';

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
		private countyService: CountyService,
		private formBuilder: FormBuilder
	) {
	}

	getParams(value = {}) {
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

	getCountyData(params) {
		return lastValueFrom(this.httpService.get<Response>(this.countyUrl + '/getCountyData', { params }));
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
		const url = `${this.classUrl}`;
		const params = {
			params: {
				type: type ? type : ''
			}
		};
		return lastValueFrom(this.httpService.get<Response>(url, params));
	}
	public async themeSelected(filter, layer, cqlFilter) {
		const { themeSelected } = filter;

		if (filter.themeSelected.value.value !== 'ALL') {
			const value = {
				name: `'${filter.themeSelected.value.name}'`,
				gid: filter.themeSelected.value.gid,
				geocode: `'${filter.themeSelected.value.geocodigo}'`
			};

			if (layer.filter[filter.themeSelected.type].param) {
				layer.layerData.viewparams =
					layer.layerData.viewparams ?
						`${layer.layerData.viewparams};${layer.filter[filter.themeSelected.type].field}:${value[layer.filter[filter.themeSelected.type].value]}` :
						`${layer.filter[filter.themeSelected.type].field}:${value[layer.filter[filter.themeSelected.type].value]}`;
			} else {
				layer.layerData.cql_filter =
					await this.setCqlFilter(
						value[layer.filter[filter.themeSelected.type].value], layer.filter[filter.themeSelected.type].field, cqlFilter);
			}
		} else {
			delete layer.layerData.cql_filter;
		}
		if (layer.tableInfocolumns) {
			let newFilter;
			switch (themeSelected.type) {
				case 'city':
					newFilter = this.filterByCity(layer.tableInfocolumns, themeSelected);
				case 'region':
					 newFilter = await this.filterByCounty(layer.tableInfocolumns, themeSelected)
			}
			layer.layerData.cql_filter = newFilter
			return layer

		}
		layer.layerData.layers = layer.filter[filter.themeSelected.type].view;

		return layer;
	}

	private setCqlFilter(value, column, cqlFilter) {
		let cFilter = cqlFilter ? cqlFilter : '';

		cFilter += cFilter ? ';' : '';
		cFilter += `${column}=${value} `;

		return cFilter;
	}

	private filterByCity(layerInfoColumns, theme) {
		const columnGeocod = layerInfoColumns.find(col => col.secondaryType === 'city_geocode')
		const columnName = layerInfoColumns.find(col => col.secondaryType === 'city_name')
		let filter;
		if (columnGeocod && theme.value.hasOwnProperty('geocodigo')) {
			filter = `${columnGeocod.columnName}=${theme.value.geocodigo}`
		} else if (columnName && theme.value.hasOwnProperty('name')) {
			filter = `${columnName.columnName}='${theme.value.name.replace("'", "''")}'`
		}
		return filter;
	}

	private async filterByCounty(layerInfoColumns, theme) {
		const { value: { name } } = theme;
		const countyData = await this.countyService.getCountyData({ name })
		.then((response: Response) => response.data)
		const columnGeocod = layerInfoColumns.find(col => col.secondaryType === 'county_geocode')
		const columnName = layerInfoColumns.find(col => col.secondaryType === 'county_name')

		let filter;
		if (!columnGeocod || !columnName) {
			filter = this.filterCountyUsingCity(layerInfoColumns, countyData);
		}
		return filter;
	}

	private filterCountyUsingCity(layerInfoColumns, countyData) {
		const cityGeocod = layerInfoColumns.find(col => col.secondaryType === 'city_geocode')
		const cityName = layerInfoColumns.find(col => col.secondaryType === 'city_name')
		let filter;
		if (cityGeocod) {
			filter = `${cityGeocod.columnName} IN (${countyData.geocodeList.join(', ')})`
		} else if (cityName) {
			filter = `${cityName.columnName} IN (${countyData.nameList.join(', ')})`
		}
		return filter
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
