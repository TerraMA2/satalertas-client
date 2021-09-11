import { HTTPService } from './http.service';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LayerGroup } from 'src/app/models/layer-group.model';
import { Response } from '../models/response.model';

@Injectable({
	providedIn: 'root'
})
export class GroupService {
	URL_REPORT_SERVER = environment.serverUrl;
	url = `${ this.URL_REPORT_SERVER }/group`;

	constructor(
		private httpService: HTTPService
	) { }

	async getAll() {
		return await this.httpService.get<Response>(this.url)
		.toPromise()
		.then((response: Response) => response.data);
	};

	async getCodGroups() {
		const codUrl = `${ this.url }/getCodGroups`;
		return await this.httpService.get<any>(codUrl)
		.toPromise()
		.then((response: Response) => response.data);
	}

	async createNewGroup(params) {
		return await this.httpService.post(this.url, { ...params }).toPromise()
		.then((response: Response) => response.data);
	}

	async editGroup(params) {
		return await this.httpService.put(this.url, { ...params }).toPromise()
		.then((response: Response) => response.data);
	}

	async removeGroup(groupId) {
		const deleteUrl = `${ this.url }/${ groupId }`;
		return await this.httpService.delete(deleteUrl).toPromise()
		.then((response: Response) => response.data);
	}
}
