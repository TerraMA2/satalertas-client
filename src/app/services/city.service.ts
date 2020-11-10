import {Injectable} from '@angular/core';

import {environment} from '../../environments/environment';

import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CityService {
    urlCity = environment.reportServerUrl + '/city';

    constructor(
        private http: HttpClient
    ) {
    }

    getAll() {
        return this.http.get(this.urlCity + '/getAll').toPromise();
    }

    getAllSimplified() {
        return this.http.get(this.urlCity + '/getAllSimplified').toPromise();
    }

    getAllSimplifiedRegions() {
        return this.http.get(this.urlCity + '/getAllRegionsSimplified').toPromise();
    }

    getAllSimplifiedMesoregions() {
        return this.http.get(this.urlCity + '/getAllMesoregionsSimplified').toPromise();
    }

    getAllSimplifiedImmediateRegion() {
        return this.http.get(this.urlCity + '/getAllImmediateRegionSimplified').toPromise();
    }

    getAllSimplifiedIntermediateRegion() {
        return this.http.get(this.urlCity + '/getAllIntermediateRegionSimplified').toPromise();
    }

    getAllSimplifiedPjbh() {
        return this.http.get(this.urlCity + '/getAllPjbhSimplified').toPromise();
    }

    getAllSimplifiedProjus() {
        return this.http.get(this.urlCity + '/getAllProjusSimplified').toPromise();
    }

    getAllSimplifiedMicroregions() {
        return this.http.get(this.urlCity + '/getAllMicroregionsSimplified').toPromise();
    }
}
