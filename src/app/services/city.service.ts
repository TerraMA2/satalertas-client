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

    getAllSimplifiedMicroregions() {
        return this.http.get(this.urlCity + '/getAllMicroregionsSimplified').toPromise();
    }
}
