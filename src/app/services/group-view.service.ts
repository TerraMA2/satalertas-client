import {Injectable} from '@angular/core';

import {environment} from '../../environments/environment';

import {HTTPService} from './http.service';

@Injectable({
    providedIn: 'root'
})

export class GroupViewService {

    url = environment.reportServerUrl + '/groupView';

    constructor(
        private httpService: HTTPService
    ) {}

    getAll() {
        return this.httpService.get<any>(this.url + '/').toPromise();
    }

    update(params) {
        return this.httpService.put(this.url + '/', {params}).toPromise();
    }

    updateAdvanced(params) {
        return this.httpService.put(this.url + '/advanced', {params}).toPromise();
    }

    async getByGroupId(groupId) {
        const parameters = {id_group: groupId};
        return await this.httpService.get<any>(this.url + '/getByIdGroup', {params: parameters}).toPromise();
    }

    add(params) {
        return this.httpService.post(this.url + '/', {params}).toPromise();
    }

    async getAvailableLayers(groupId) {
        const parameters = {id_group: groupId};
        const result = await this.httpService.get<any>(this.url + '/getNotBelongingToTheGroup', {params: parameters}).toPromise();
        return result
    }
}
