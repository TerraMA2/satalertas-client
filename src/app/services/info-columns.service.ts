import {Injectable} from '@angular/core';

import {HTTPService} from './http.service';

import {environment} from '../../environments/environment';

const URL_REPORT_SERVER = environment.reportServerUrl;

@Injectable({
    providedIn: 'root'
})
export class InfoColumnsService {
    url = `${URL_REPORT_SERVER}/infoColumns`;
    constructor(
        private httpService: HTTPService
    ) {
    }

    async getInfoColumns(viewId?) {
        const parameters = {viewId};

        return await this.httpService.get<any>(this.url + '/', {params: parameters}).toPromise();
    }
}
