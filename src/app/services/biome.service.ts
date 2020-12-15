import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BiomeService {

    urlBiome = environment.reportServerUrl + '/biome';

    constructor(
        private http: HttpClient
    ) {
    }

    getAll() {
        return this.http.get(this.urlBiome + '/getAll').toPromise();
    }

    getAllSimplified() {
        return this.http.get(this.urlBiome + '/getAllSimplified').toPromise();
    }
}
