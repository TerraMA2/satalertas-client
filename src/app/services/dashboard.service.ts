import { Injectable } from '@angular/core';

import { Alert } from '../models/alert.model';

import { environment } from '../../environments/environment';

import { HTTPService } from './http.service';
import { FilterService } from './filter.service';

@Injectable({
	providedIn: 'root'
})
export class DashboardService {

	urlDashboard = environment.reportServerUrl + '/dashboard';

	constructor(
		private httpService: HTTPService,
		private filterService: FilterService
	) {
	}

	async getAnalysisTotals(alerts: Alert [] = []) {
		const url = this.urlDashboard + '/getAnalysisTotals';

		const parameters = this.filterService.getParams(alerts);
		const params = {
			params: parameters
		};

		return await this.httpService.get<any>(url, params).toPromise();
	}

	async getDetailsAnalysisTotals(alerts: Alert [] = []) {
		const url = this.urlDashboard + '/getDetailsAnalysisTotals';

		const parameters = this.filterService.getParams(alerts);
		const params = {
			params: parameters
		};

		return await this.httpService.get<any>(url, params).toPromise();
	}
}
