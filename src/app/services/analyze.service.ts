import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {

  urlAnalyze = environment.reportServerUrl + '/analyze';

  constructor(
    private http: HttpClient
  ) {}

  async getAllClassByType(type) {
    const url = `${this.urlAnalyze}/getAllClassByType`;

    return await this.http.get(url, { params: { type: type ? type : '' } }).toPromise();
  }

}
