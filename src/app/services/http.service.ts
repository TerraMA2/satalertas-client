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
		if (!url) {
			return;
		}
		return this.httpClient.get<T>(url, params);
	}

	post<T>(url, params = {}): Observable<T> {
		if (!url) {
			return;
		}
		return this.httpClient.post<T>(url, params);
	}

	put<T>(url, params = {}): Observable<T> {
		if (!url) {
			return;
		}
		return this.httpClient.put<T>(url, params);
	}

	delete<T>(url, params = {}): Observable<T> {
		if (!url) {
			return;
		}
		return this.httpClient.delete<T>(url, params);
	}

}
