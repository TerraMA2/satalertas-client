import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';

import {Layer} from '../models/layer.model';
import {environment} from '../../environments/environment';
import {HTTPService} from './http.service';

const URL_REPORT_SERVER = environment.reportServerUrl;

@Injectable({
    providedIn: 'root'
})
export class TableService {

    loadTableData = new Subject();

    unloadTableData = new Subject<Layer>();

    loadReportTableData = new Subject();

    clearTable = new Subject();

    constructor(
      private httpService: HTTPService
    ) {
    }

    async getReportLayers() {
        const url = `${URL_REPORT_SERVER}/view/getReportLayers`;

        return await this.httpService.get<any>(url).toPromise();
    }
}
