import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import { HTTPService } from './http.service';

import { FilterService } from './filter.service';

import { Analysis } from '../models/analysis.model';

import { Response } from '../models/response.model';

@Injectable({
	providedIn: 'root'
})
export class DashboardService {

	urlDashboard = environment.serverUrl + '/dashboard';

	constructor(
		private httpService: HTTPService,
		private filterService: FilterService
	) {
	}

	async getAnalysis() {
		const url = this.urlDashboard + '/getAnalysis';

		const parameters = this.filterService.getParams();
		const params = {
			params: parameters
		};

		return await this.httpService.get<Response>(url, params).toPromise();
	}

	async getAnalysisCharts(analysis: Analysis [] = []) {
		const url = this.urlDashboard + '/getAnalysisCharts';

		const parameters = this.filterService.getParams(analysis);
		const params = {
			params: parameters
		};

		return await this.httpService.get<Response>(url, params).toPromise();
	}
}
