import {Injectable} from '@angular/core';

import {environment} from '../../environments/environment';

import {HTTPService} from './http.service';

@Injectable({
    providedIn: 'root'
})
export class CityService {
    urlCity = environment.reportServerUrl + '/city';

    constructor(
        private httpService: HTTPService
    ) {
    }

    getAll() {
        return this.httpService.get<any>(this.urlCity + '/getAll').toPromise();
    }

    getAllSimplified() {
        return this.httpService.get<any>(this.urlCity + '/getAllSimplified').toPromise();
    }

    getAllSimplifiedRegions() {
        return this.httpService.get<any>(this.urlCity + '/getAllRegionsSimplified').toPromise();
    }

    getAllSimplifiedMesoregions() {
        return this.httpService.get<any>(this.urlCity + '/getAllMesoregionsSimplified').toPromise();
    }

    getAllSimplifiedImmediateRegion() {
        return this.httpService.get<any>(this.urlCity + '/getAllImmediateRegionSimplified').toPromise();
    }

    getAllSimplifiedIntermediateRegion() {
        return this.httpService.get<any>(this.urlCity + '/getAllIntermediateRegionSimplified').toPromise();
    }

    getAllSimplifiedPjbh() {
        return this.httpService.get<any>(this.urlCity + '/getAllPjbhSimplified').toPromise();
    }

    getAllSimplifiedProjus() {
        return this.httpService.get<any>(this.urlCity + '/getAllProjusSimplified').toPromise();
    }

    getAllSimplifiedMicroregions() {
        return this.httpService.get<any>(this.urlCity + '/getAllMicroregionsSimplified').toPromise();
    }
}
