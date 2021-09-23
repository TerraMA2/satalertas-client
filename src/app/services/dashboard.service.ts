import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import { HTTPService } from './http.service';

import { FilterService } from './filter.service';

import { Analysis } from '../models/analysis.model';

import { Response } from '../models/response.model';
import { lastValueFrom } from 'rxjs';

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

		return lastValueFrom(await this.httpService.get<Response>(url, params));
	}

	getAnalysisCharts(analysis: Analysis [] = []) {
		const url = this.urlDashboard + '/getAnalysisCharts';

		const parameters = this.filterService.getParams(analysis);
		const params = {
			params: parameters
		};

		return lastValueFrom(this.httpService.get<Response>(url, params));
	}
}
