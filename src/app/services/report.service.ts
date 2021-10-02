import { Injectable } from '@angular/core';

import { lastValueFrom, Subject } from 'rxjs';

import { HTTPService } from './http.service';

import { environment } from '../../environments/environment';

import { Response } from '../models/response.model';

import { Util } from '../utils/util';

import { ExportService } from './export.service';

@Injectable({
	providedIn: 'root'
})
export class ReportService {
	URL_REPORT_SERVER = environment.serverUrl + '/report';

	changeReportType = new Subject<object>();

	constructor(
		private httpService: HTTPService,
		private exportService: ExportService
	) {
	}

	get(param) {
		const url = this.URL_REPORT_SERVER;
		const params = {
			params: param
		};
		return lastValueFrom(this.httpService.get<Response>(url, params));
	}

	async getReportData(carGid, date, filter, type) {
		const url = `${ this.URL_REPORT_SERVER }/getReport`;

		const params = {
			params: {
				carGid,
				date,
				filter,
				type
			}
		};

		return lastValueFrom(await this.httpService.get<Response>(url, params));
	}

	downloadPdf(reportData, document, reportName, linkTag, downloadVectors) {
		const downloadURL = window.URL.createObjectURL(Util.base64toBlob(document, 'application/pdf'));

		linkTag.setAttribute('download', reportName);
		linkTag.setAttribute('href', downloadURL);
		linkTag.click();
		if (downloadVectors) {
			const { vectorViews } = reportData;
			const fileName = reportName.split('.')[0];
			this.exportService.getVectors(vectorViews, fileName);
		}
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

	getReportTableData(url, params) {
		return lastValueFrom(this.httpService.get<Response>(environment.serverUrl + url, params));
	}

	async getNDVI(carGid, date) {
		const url = this.URL_REPORT_SERVER + '/getNDVI';

		const params = {
			params: {
				carGid,
				date,
				filter: null,
				type: 'prodes'
			}
		};

		return lastValueFrom(await this.httpService.get<Response>(url, params)).then((response: Response) => {
			const alerts = response.data;
			return alerts.map(alert => {
				const {geoserverImage, options} = alert;
				const chartOptions = options['options'];
				const chartData = options['data'];
				return {
					geoserverImage: geoserverImage.image,
					chartData,
					chartOptions
				};
			});
		});
	}
}
