import { Injectable } from '@angular/core';
import { HTTPService } from './http.service';
import { environment } from '../../environments/environment';
import { Response } from '../models/response.model';
import { lastValueFrom } from 'rxjs';

const URL_REPORT_SERVER = environment.serverUrl;

@Injectable({
	providedIn: 'root'
})
export class InfoColumnsService {
	url = `${URL_REPORT_SERVER}/infoColumns`;

	constructor(
		private httpService: HTTPService
	) {
	}

	getInfoColumns(viewId?) {
		const parameters = { viewId };
		return lastValueFrom(this.httpService.get<Response>(this.url + '/', { params: parameters }));
	}
	async getByTableName(tableName) {
		return lastValueFrom(this.httpService.get<Response>(this.url + `/getByTableName?tableName=${tableName}`))
			.then(data => {
				return data;
			});
	}
	async getTableNames() {
		return lastValueFrom(this.httpService.get<Response>(this.url + '/getAllTables'))
			.then(response => response.data);
	}
	async getTableColumns(tableId) {
		const parameters = { tableId };
		return lastValueFrom(this.httpService.get<Response>(this.url + '/tableColumns', { params: parameters }))
			// .then(res => res.data)
			.then(response => {
				const { data } = response;
				// response.data = data.filter(({ view_id }) => view_id === table)
				return response;
			});
	}
	async getTypesOptions() {
		return lastValueFrom(this.httpService.get<Response>(this.url + '/getSecondaryTypes'))
			// .then(res => res.data)
			.then(response => { return response.data; });
	}
	async getTableInfoColumns(tableName) {
		const parameters = { tableName };
		return lastValueFrom(this.httpService.get<Response>(this.url + '/getTableInfoColumns', { params: parameters }))
			// .then(res => res.data)
			.then(response => { return response.data; });
	}
	async sendInfocolumnsEditions(editions) {
		// const parameters = { editions }
		return lastValueFrom(this.httpService.put(this.url + '/tableColumns', { editions }));
	}
}
