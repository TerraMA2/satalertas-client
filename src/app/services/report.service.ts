import {Injectable} from '@angular/core';

import {Property} from '../models/property.model';

import {Subject} from 'rxjs';

import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    URL_REPORT_SERVER = environment.reportServerUrl + '/report';

    property = new Subject<Property>();

    changeReportType = new Subject();

    constructor(
        private http: HttpClient
    ) {
    }

    async getReportCarData(carRegister, date, filter, type) {
        const url = `${this.URL_REPORT_SERVER}/getReportCarData`;

        const parameters = {carRegister, date, filter, type};

        return await this.http.get(url, {params: parameters}).toPromise();
    }

    async getPointsAlerts(carRegister, date, filter, type) {
        const url = `${this.URL_REPORT_SERVER}/getPointsAlerts`;

        const parameters = {carRegister, date, filter, type};

        return await this.http.get(url, {params: parameters}).toPromise();
    }

    async createPdf(reportData) {
        const url = this.URL_REPORT_SERVER + '/createPdf';
        const parameters = {reportData};

        return await this.http.post(url, {params: parameters}).toPromise();
    }


    async generatePdf(reportData) {
        const url = this.URL_REPORT_SERVER + '/generatePdf';
        const parameters = {reportData};

        return await this.http.post(url, {params: parameters}).toPromise();
    }

    async getReportsByCARCod(carCode) {
        const url = this.URL_REPORT_SERVER + '/getReportsByCARCod';
        const parameters = {carCode};

        return await this.http.get(url, {params: parameters}).toPromise();
    }

    async getReportById(id) {
        const url = this.URL_REPORT_SERVER;
        const parameters = {id};

        return await this.http.get(url, {params: parameters}).toPromise();
    }
}
