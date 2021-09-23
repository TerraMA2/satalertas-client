import { Injectable } from '@angular/core';

import { lastValueFrom, Subject } from 'rxjs';

import { HTTPService } from './http.service';

import { environment } from '../../environments/environment';

import { Response } from '../models/response.model';

@Injectable({
	providedIn: 'root'
})
export class ReportService {
	URL_REPORT_SERVER = environment.serverUrl + '/report';

	changeReportType = new Subject<void>();

	constructor(
		private httpService: HTTPService
	) {
	}

	async getReportCarData(carRegister, date, filter, type) {
		const url = `${ this.URL_REPORT_SERVER }/getReportCarData`;

		const params = {
			params: {
				carRegister,
				date,
				filter,
				type
			}
		};

		return lastValueFrom(await this.httpService.get<Response>(url, params));
	}

	async getPointsAlerts(carRegister, date, filter, type) {
		const url = `${ this.URL_REPORT_SERVER }/getPointsAlerts`;

		const params = {
			params: {
				carRegister,
				date,
				filter,
				type
			}
		};

		return lastValueFrom(await this.httpService.get<Response>(url, params));
	}

	async createPdf(reportData) {
		const url = this.URL_REPORT_SERVER + '/createPdf';
		const params = {
			params: {
				reportData
			}
		};
		return lastValueFrom(await this.httpService.post<Response>(url, params));
	}


	async generatePdf(reportData) {
		const url = this.URL_REPORT_SERVER + '/generatePdf';
		const params = {
			params: {
				reportData
			}
		};

		return lastValueFrom(await this.httpService.post<Response>(url, params));
	}

	getReportsByCARCod(carGid) {
		const url = this.URL_REPORT_SERVER + '/getReportsByCARCod';
		const params = {
			params: {
				carGid
			}
		};

		return lastValueFrom(this.httpService.get<Response>(url, params));
	}

	getReportById(id) {
		const url = this.URL_REPORT_SERVER;
		const params = {
			params: {
				id
			}
		};
		return lastValueFrom(this.httpService.get<Response>(url, params));
	}

	getReportTableData(url, params) {
		return lastValueFrom(this.httpService.get<Response>(environment.serverUrl + url, params));
	}
}
