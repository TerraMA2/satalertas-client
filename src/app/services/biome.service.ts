import {Injectable} from '@angular/core';

import {HTTPService} from './http.service';

import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BiomeService {

    urlBiome = environment.reportServerUrl + '/biome';

    constructor(
        private httpService: HTTPService
    ) {
    }

    getAll() {
        return this.httpService.get<any>(this.urlBiome + '/getAll').toPromise();
    }

    getAllSimplified() {
        return this.httpService.get<any>(this.urlBiome + '/getAllSimplified').toPromise();
    }
}
