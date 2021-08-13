import { Injectable } from '@angular/core';

import { Property } from '../models/property.model';

import { Subject } from 'rxjs';

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

	async getSynthesis(carRegister, date, formattedFilterDate, synthesisConfig) {
		const url = `${ this.URL_REPORT_SERVER }/getSynthesis`;
		const params = {
			params: {
				carRegister,
				date,
				formattedFilterDate,
				synthesisConfig
			}
		};
		return await this.httpService.post(url, params).toPromise();
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
			})
		});
	}

	getChart(chartData, legends) {
		const years = [];
		const values = [];
		chartData.forEach(data => {
			const value = Number(data.value);
			const year = data.year;
			years.push(year);
			values.push(value);
		});
		return this.getChartJson(legends, years, values);
	}

	getPerPropertyChart(chartData, propertyArea, label) {
		const chartDataPerProperty = chartData.map(data => [propertyArea, data.value]);
		return chartDataPerProperty.map(data => this.getChartJson(null, ['Área imóvel', label], data));
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
