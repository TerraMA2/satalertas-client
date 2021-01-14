import {Injectable} from '@angular/core';

import {environment} from '../../environments/environment';

import {HttpClient} from '@angular/common/http';

import { GroupView } from 'src/app/models/group-view.model';

@Injectable({
    providedIn: 'root'
})

export class GroupService {

    url = environment.reportServerUrl + '/group';

    constructor(
        private http: HttpClient
    ) {}

    getAll() {
        return this.http.get<any>(this.url + '/').toPromise();
    }

    update(params) {
        return this.http.put(this.url + '/', {params}).toPromise();
    }

    add(params) {
        return this.http.post(this.url + '/', {params}).toPromise();
    }
}