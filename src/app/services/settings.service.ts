import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  URL_REPORT_SERVER = environment.reportServerUrl;

    constructor(private http: HttpClient) { }

    async getFiles() {
      const url = `${this.URL_REPORT_SERVER}/algo` //pegar endpoint correto
    return await this.http.get<any>('assets/files.json')
      .toPromise()
      .then(res => res);
    }
}
