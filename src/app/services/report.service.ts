import { Injectable } from '@angular/core';

import { Property } from '../models/property.model';

import { Subject } from 'rxjs';

import { HTTPService } from './http.service';

import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ReportService {

	URL_REPORT_SERVER = environment.reportServerUrl + '/report';

	property = new Subject<Property>();

	changeReportType = new Subject();

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

		return await this.httpService.get<any>(url, params).toPromise();
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

		return await this.httpService.get<any>(url, params).toPromise();
	}

	async createPdf(reportData) {
		const url = this.URL_REPORT_SERVER + '/createPdf';
		const params = {
			params: {
				reportData
			}
		};
		return await this.httpService.post(url, params).toPromise();
	}


	async generatePdf(reportData) {
		const url = this.URL_REPORT_SERVER + '/generatePdf';
		const params = {
			params: {
				reportData
			}
		};

		return await this.httpService.post(url, params).toPromise();
	}

	async getReportsByCARCod(carCode) {
		const url = this.URL_REPORT_SERVER + '/getReportsByCARCod';
		const params = {
			params: {
				carCode
			}
		};

		return await this.httpService.get<any>(url, params).toPromise();
	}

	async getReportById(id) {
		const url = this.URL_REPORT_SERVER;
		const params = {
			params: {
				id
			}
		};
		return await this.httpService.get<any>(url, params).toPromise();
	}
}
