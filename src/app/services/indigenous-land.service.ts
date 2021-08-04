import {Injectable} from '@angular/core';

import {environment} from '../../environments/environment';

import {HTTPService} from './http.service';

@Injectable({
    providedIn: 'root'
})
export class IndigenousLandService {

    urlRegion = environment.reportServerUrl + '/indigenousLand';

    constructor(
        private httpService: HTTPService
    ) {
    }

    getAll() {
        return this.httpService.get<any>(this.urlRegion + '/getAll').toPromise();
    }

    getAllSimplified() {
        return this.httpService.get<any>(this.urlRegion + '/getAllSimplified').toPromise();
    }
}
