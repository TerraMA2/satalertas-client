import { Injectable } from '@angular/core';

import ConfigJson from '../../assets/config.json';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() {}

  getConfig(name) {
    if (name) {
      return ConfigJson[name];
    }
    return ConfigJson;
  }

}
