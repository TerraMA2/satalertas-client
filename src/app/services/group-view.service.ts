import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import { HTTPService } from './http.service';

import { Response } from '../models/response.model';

import { lastValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class GroupViewService {

	url = environment.serverUrl + '/groupView';

	constructor(
		private httpService: HTTPService
	) {
	}

	getAll() {
		return lastValueFrom(this.httpService.get<Response>(this.url + '/'));
	}

	update(params) {
		return lastValueFrom(this.httpService.put(this.url + '/', { params }));
	}

	updateAdvanced(params) {
		return lastValueFrom(this.httpService.put(this.url + '/advanced', { params }));
	}

	async getByGroupId(parameters) {
		// const parameters = { groupId };
		return lastValueFrom(await this.httpService.get<Response>(this.url + '/getByGroupId',
			{ params: parameters }
		));
	}

	add(params) {
		return lastValueFrom(this.httpService.post<Response>(this.url + '/', { params }));
	}

	async getAvailableLayers(groupId) {
		const parameters = { groupId };
		return lastValueFrom(await this.httpService.get<Response>(this.url + '/getAvailableLayers',
			{ params: parameters }
		));
	}
}
