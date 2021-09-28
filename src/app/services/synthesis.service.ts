import { Injectable } from '@angular/core';

import { Property } from '../models/property.model';

import { lastValueFrom, Subject } from 'rxjs';

import { HTTPService } from './http.service';

import { environment } from '../../environments/environment';

import { Response } from '../models/response.model';

import { ReportService } from './report.service';

@Injectable({
	providedIn: 'root'
})
export class SynthesisService {

	URL_REPORT_SERVER = environment.serverUrl + '/synthesis';

	property = new Subject<Property>();

	constructor(
		private httpService: HTTPService,
		private reportService: ReportService
	) {
	}

	async getPropertyData(carGId) {
		const url = `${ this.URL_REPORT_SERVER }/getPropertyData`;
		const params = {
			params: {
				carGId
			}
		};
		return lastValueFrom(await this.httpService.get<Response>(url, params));
	}

	async getVisions(carGId, date) {
		const url = `${ this.URL_REPORT_SERVER }/getVisions`;
		const params = {
			params: {
				carGId,
				date
			}
		};
		return lastValueFrom(await this.httpService.get<Response>(url, params));
	}

	async getLegends(carGId) {
		const url = `${ this.URL_REPORT_SERVER }/getLegends`;
		const params = {
			params: {
				carGId
			}
		};
		return lastValueFrom(await this.httpService.get<Response>(url, params));
	}

	async getDetailedVisions(carGId, date) {
		const url = `${ this.URL_REPORT_SERVER }/getDetailedVisions`;
		const params = {
			params: {
				carGId,
				date
			}
		};
		return lastValueFrom(await this.httpService.get<Response>(url, params));
	}

	async getDeforestation(carGId) {
		const url = `${ this.URL_REPORT_SERVER }/getDeforestation`;
		const params = {
			params: {
				carGId
			}
		};
		return lastValueFrom(await this.httpService.get<Response>(url, params));
	}

	async getDeterHistory(carGId) {
		const url = `${ this.URL_REPORT_SERVER }/getDeterHistory`;
		const params = {
			params: {
				carGId
			}
		};
		return lastValueFrom(await this.httpService.get<Response>(url, params));
	}

	async getProdesHistory(carGId) {
		const url = `${ this.URL_REPORT_SERVER }/getProdesHistory`;
		const params = {
			params: {
				carGId
			}
		};
		return lastValueFrom(await this.httpService.get<Response>(url, params));
	}

	async getFireSpotHistory(carGId) {
		const url = `${ this.URL_REPORT_SERVER }/getFireSpotHistory`;
		const params = {
			params: {
				carGId
			}
		};
		return lastValueFrom(await this.httpService.get<Response>(url, params));
	}

	async getBurnedAreaHistory(carGId) {
		const url = `${ this.URL_REPORT_SERVER }/getBurnedAreaHistory`;
		const params = {
			params: {
				carGId
			}
		};
		return lastValueFrom(await this.httpService.get<Response>(url, params));
	}

	async getCharts(carGId) {
		const url = `${ this.URL_REPORT_SERVER }/getCharts`;
		const params = {
			params: {
				carGId
			}
		};
		return lastValueFrom(await this.httpService.get<Response>(url, params));
	}

	getNDVI(carRegister, date) {
		return this.reportService.getPointsAlerts(carRegister, date, null, 'prodes').then((response: Response) => {
			const alerts = response.data;
			return alerts.map(alert => {
				const chartOptions = alert['options']['options'];
				const chartData = alert['options']['data'];
				const url = alert['url'];
				return {
					geoserverImageNdvi: url,
					chartData,
					chartOptions
				};
			});
		});
	}

	getChart(chartData, legends) {
		const years = [];
		const values = [];
		if (chartData) {
			chartData.forEach(data => {
				const value = parseFloat(data.value);
				const year = data.year;
				years.push(year);
				values.push(value);
			});
		}
		return this.getChartJson(legends, years, values);
	}

	getPerPropertyChart(chartData, propertyArea, label) {
		if (chartData) {
			const chartDataPerProperty = chartData.map(data => [propertyArea, parseFloat(data.value)]);
			return chartDataPerProperty.map(data => this.getChartJson(null, ['Área imóvel', label], data));
		}
	}

	private getChartJson(legends: string | string[], labels: string | string[], data) {
		if (!Array.isArray(labels)) {
			labels = [labels];
		}
		const backgroundColors = labels.map(label => '#' + Math.floor(Math.random() * 16777215).toString(16));
		return {
			labels,
			datasets: [
				{
					label: legends,
					backgroundColor: backgroundColors,
					data
				}
			]
		};
	}
}
