import {Injectable} from '@angular/core';

import {environment} from '../../environments/environment';

import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ProjusService {

    urlRegion = environment.reportServerUrl + '/projus';

    constructor(
        private http: HttpClient
    ) {
    }

    getAll() {
        return this.http.get(this.urlRegion + '/getAll').toPromise();
    }

    getAllSimplified() {
        return this.http.get(this.urlRegion + '/getAllSimplified').toPromise();
    }
}
