import {Injectable} from '@angular/core';

import {environment} from '../../environments/environment';

import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class GroupViewService {

    url = environment.reportServerUrl + '/groupView';

    constructor(
        private http: HttpClient
    ) {}

    getAll() {
        return this.http.get(this.url + '/').toPromise();
    }

    update(params) {
        return this.http.put(this.url + '/', {params}).toPromise();
    }

    async getByGroupId(groupId) {
        const parameters = {id_group: groupId};
        return await this.http.get<any[]>(this.url + '/getByIdGroup', {params: parameters}).toPromise();
    }

    add(params) {
        return this.http.post(this.url + '/', {params}).toPromise();
    }

    async getAvailableLayers(groupId) {
        const parameters = {id_group: groupId};
        return await this.http.get<any[]>(this.url + '/getNotBelongingToTheGroup', {params: parameters}).toPromise();
    }
}
