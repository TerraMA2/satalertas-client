import {Injectable} from '@angular/core';

import {HTTPService} from './http.service';

import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AnalyzeService {

    urlAnalyze = environment.reportServerUrl + '/analyze';

    constructor(
        private httpService: HTTPService
    ) {
    }

    async getAllClassByType(type) {
        const url = `${this.urlAnalyze}/getAllClassByType`;
        const params = {
            params: {
                type: type ? type : ''
            }
        };

        return await this.httpService.get<any>(url, params).toPromise();
    }

}
