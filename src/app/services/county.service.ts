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

@Injectable({
	providedIn: 'root'
})
export class CountyService {
	url = environment.serverUrl + '/county';


	constructor(
		private httpService: HTTPService
	) {
	}

	getAllCounties() {
		return lastValueFrom(this.httpService.get<Response>(this.url))
	}

	getCountyData(params) {
		return lastValueFrom(this.httpService.get<Response>(this.url + '/countyData', {params}))
	}

}
