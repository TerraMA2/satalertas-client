import { Injectable } from '@angular/core';

import ConfigJson from '../../assets/config/config.json';
import MPMTConfigJson from '../../assets/config/mpmt/mpmt-config.json';

import { environment } from '../../environments/environment';
import { Project } from '../enum/project.enum';

const PROJECT = environment.project;

@Injectable({
	providedIn: 'root'
})
export class ConfigService {
	constructor() {
	}

	getConfig(name) {
		let configJson;
		switch (PROJECT) {
			case Project.MPMT: {
				configJson = MPMTConfigJson;
				break;
			}
			case Project.TERRAMA2: {
				configJson = ConfigJson;
				break;
			}
			default: {
				configJson = ConfigJson;
				break;
			}
		}
		if (name) {
			return configJson[name];
		}
		return configJson;
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

	getSidebarSettingsConfig(name = '') {
		const sidebarConfig = this.getConfig('sidebarSettings');
		if (name) {
			return sidebarConfig[name];
		}
		return sidebarConfig;
	}

	getSettingsConfig(name = '') {
		const sidebarConfig = this.getConfig('settings');
		if (name) {
			return sidebarConfig[name];
		}
		return sidebarConfig;
	}

	getAboutConfig(name = '') {
		const sidebarConfig = this.getConfig('about');
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

	getFilterConfig(name = '') {
		const mapConfig = this.getConfig('filter');
		if (name) {
			return mapConfig[name];
		}
		return mapConfig;
	}

	getSynthesisConfig(name = '') {
		const appConfig = this.getConfig('synthesis');
		if (name) {
			return appConfig[name];
		}
		return appConfig;
	}
}
