import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { HTTPService } from './http.service';

import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ReportService {
	URL_REPORT_SERVER = environment.serverUrl + '/report';

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

	async getReportsByCARCod(carGid) {
		const url = this.URL_REPORT_SERVER + '/getReportsByCARCod';
		const params = {
			params: {
				carGid
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
