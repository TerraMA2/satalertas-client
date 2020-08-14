import { Injectable } from '@angular/core';

import { Vision } from '../models/vision.model';

import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  URL_REPORT_SERVER = environment.reportServerUrl + '/export';

  constructor(
    private http: HttpClient
  ) { }


  async getExport(parameters) {
    const url = this.URL_REPORT_SERVER + '/get';

    return await this.http.post(url, { params: parameters }).toPromise();
  }

  async getPointsAlerts(carRegister, date, filter, type) {
    const url = `${this.URL_REPORT_SERVER}/getPointsAlerts`;

    const parameters = {carRegister, date, filter, type };

    return await this.http.get(url, { params: parameters }).toPromise();
  }

  async getSynthesisCarData(carRegister, date, filter) {
    const url = `${this.URL_REPORT_SERVER}/getSynthesisCarData`;

    const parameters = {carRegister, date, filter };

    return await this.http.get(url, { params: parameters }).toPromise();
  }


  async generatePdf(reportData) {
    const url = this.URL_REPORT_SERVER + '/generatePdf';
    const parameters = { reportData };

    return await this.http.post(url, { params: parameters }).toPromise();
  }
}
