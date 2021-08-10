import { HTTPService } from './http.service';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class GroupService {
	URL_REPORT_SERVER = environment.serverUrl;
	url = `${ this.URL_REPORT_SERVER }/group`;

	constructor(private httpService: HTTPService) {
	}

	async getAll() {
		return await this.httpService.get<any>(this.url)
		.toPromise()
		.then(res => res);
	};

	async getCodGroups() {
		const codUrl = `${ this.url }/getCodGroups`;
		return await this.httpService.get<any>(codUrl)
		.toPromise()
		.then(res => res);
	}

	async createNewGroup(params) {
		return await this.httpService.post(this.url, { ...params }).toPromise()
		.then(res => res);
	}

	async editGroup(params) {
		return await this.httpService.put(this.url, { ...params }).toPromise()
		.then(res => res);
	}

	async removeGroup(groupId) {
		const deleteUrl = `${ this.url }/${ groupId }`;
		return await this.httpService.delete(deleteUrl).toPromise()
		.then(res => res);
	}
}
