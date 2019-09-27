import { Injectable } from '@angular/core';

import ConfigJson from '../../assets/config.json';

import { HTTPService } from './http.service.js';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(
    private hTTPService: HTTPService
  ) {}

  get() {
    return this.hTTPService.get('../../assets/config.json');
  }

  getConfig(name) {
    if (name) {
      return ConfigJson[name];
    }
    return ConfigJson;
  }

}
