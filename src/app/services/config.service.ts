import { Injectable } from '@angular/core';

import ConfigJson from '../../assets/config.json';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

const URL_REPORT_SERVER = environment.reportServerUrl;

@Injectable({
  providedIn: 'root'
})
export class ConfigService {


  constructor(
    private http: HttpClient
  ) {}

  getConfig(name) {
    if (name) {
      return ConfigJson[name];
    }
    return ConfigJson;
  }

  getAppConfig(name = '') {
    const appConfig = this.getConfig('app');
    if (name) {
      return appConfig[name];
    }
    return appConfig;
  }

  getAuthConfig(name = '') {
    const authConfig = this.getConfig('auth');
    if (name) {
      return authConfig[name];
    }
    return authConfig;
  }

  getSidebarConfig(name = '') {
    const sidebarConfig = this.getConfig('sidebar');
    if (name) {
      return sidebarConfig[name];
    }
    return sidebarConfig;
  }

  getMapConfig(name = '') {
    const mapConfig = this.getConfig('map');
    if (name) {
      return mapConfig[name];
    }
    return mapConfig;
  }

  getReportConfig(name = '') {
    const reportConfig = this.getConfig('report');
    if (name) {
      return reportConfig[name];
    }
    return reportConfig;
  }

  async getSidebarConfigurationDynamically() {
    const parameters = { };
    const url = `${URL_REPORT_SERVER}/view/getSidebarConfigDynamic`;

    return await this.http.get(url, { params: parameters }).toPromise();
  }
}
