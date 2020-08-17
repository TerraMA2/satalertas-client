import {Injectable} from '@angular/core';

import {environment} from '../../environments/environment';

import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CarService {

    urlCar = environment.reportServerUrl + '/car';

    constructor(
        private http: HttpClient
    ) {
    }

    getAllSimplified() {
        return this.http.get(this.urlCar + '/getAllSimplified').toPromise();
    }

    async getByCpf(cpf) {
        const parameters = {cpf};

        return await this.http.get(`${this.urlCar}/getByCpf`, {params: parameters}).toPromise();
    }
}
