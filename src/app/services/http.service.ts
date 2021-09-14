import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class HTTPService {

	constructor(
		private httpClient: HttpClient
	) {
	}

	get<T>(url, params = {}): Observable<T> {
		return this.httpClient.get<T>(url, params)
	}

	post(url, params = {}) {
		if (!url) {
			return;
		}
		return this.httpClient.post(url, params);
	}

	put(url, params = {}) {
		if (!url) {
			return;
		}
		return this.httpClient.put(url, params);
	}

	delete(url, params = {}) {
		if (!url) {
			return;
		}
		return this.httpClient.delete(url, params);
	}

}
