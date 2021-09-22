import { HTTPService } from './http.service';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Response } from '../models/response.model';
import { lastValueFrom } from 'rxjs';

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
		return lastValueFrom(await this.httpService.get<Response>(this.url))
			.then((response: Response) => response.data);
	};

	async getCodGroups() {
		const codUrl = `${ this.url }/getCodGroups`;
		return lastValueFrom(await this.httpService.get<Response>(codUrl))
			.then((response: Response) => response.data);
	}

	async createNewGroup(params) {
		return lastValueFrom(await this.httpService.post<Response>(this.url, { ...params }))
			.then((response: Response) => response.data);
	}

	async editGroup(params) {
		return lastValueFrom(await this.httpService.put(this.url, { ...params }))
			.then((response: Response) => response.data);
	}

	async removeGroup(groupId) {
		const deleteUrl = `${ this.url }/${ groupId }`;
		return lastValueFrom(await this.httpService.delete(deleteUrl))
			.then((response: Response) => response.data);
	}
}
