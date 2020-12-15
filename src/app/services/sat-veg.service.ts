import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';


const URL = environment.reportServerUrl + '/satveg';

@Injectable({
    providedIn: 'root'
})
export class SatVegService {


    constructor(
        private http: HttpClient
    ) {
    }

    async get(coordinates, type?, preFilter?, filter?, filterParam?, sat?) {

        const url = `${URL}/`;

        const parameters = {
            coordinates: JSON.stringify(coordinates),
            type: type ? type : 'ndvi',
            sat: sat ? sat : 'comb',
            preFilter: preFilter ? preFilter : null,
            filter: filter ? filter : null,
            filterParam: filterParam ? filterParam : null,
        };

        return await this.http.get(url, {params: parameters}).toPromise();
    }
}
