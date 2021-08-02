import {Injectable} from '@angular/core';

import {Property} from '../models/property.model';

import {Subject} from 'rxjs';

import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';
import {Response} from '../models/response.model';
import {ReportService} from './report.service';

@Injectable({
    providedIn: 'root'
})
export class SynthesisService {

    URL_REPORT_SERVER = environment.reportServerUrl + '/synthesis';

    property = new Subject<Property>();

    constructor(
        private http: HttpClient,
        private reportService: ReportService
    ) {
    }

    async getSynthesis(carRegister, date, formattedFilterDate, synthesisConfig) {
        const url = `${this.URL_REPORT_SERVER}/getSynthesis`;
        const parameters = {carRegister, date, formattedFilterDate, synthesisConfig};
        return await this.http.post(url, {params: parameters}).toPromise();
    }
    getNDVI(carRegister, date) {
        return this.reportService.getPointsAlerts(carRegister, date, null, 'prodes').then((response: Response) => {
            const data = response.data
            const chartImages = [];
            for (const alert of data) {
                const chartOptions = alert['options']['options'];
                const chartData = alert['options']['data'];
                const url = alert['url'];
                const chartImage = {
                    geoserverImageNdvi: url,
                    chartData,
                    chartOptions
                };
                chartImages.push(chartImage);
            }
            return chartImages;
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
        const perPropertyChartDatas = [];
        const chartDataPerProperty = [];
        chartData.forEach(data => chartDataPerProperty.push([propertyArea, data.value]));
        chartDataPerProperty.forEach(data => perPropertyChartDatas.push(this.getChartJson(null, ['Área imóvel', label], data)));
        return perPropertyChartDatas;
    }

    private getChartJson(legends: string | string[], labels: string | string[], data) {
        if (!Array.isArray(labels)) {
            labels = [labels];
        }
        const backgroundColors = [];
        labels.forEach(label => backgroundColors.push('#' + Math.floor(Math.random() * 16777215).toString(16)));
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
