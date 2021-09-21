import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';

import { ConfigService } from '../services/config.service';

import { AuthService } from '../services/auth.service';

import { environment } from 'src/environments/environment';

import { SidebarService } from '../services/sidebar.service';

import { PrimeNGConfig } from 'primeng/api';

import { TranslateService } from '@ngx-translate/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	displayAbout = false;
	displaySidebar = true;
	isMobile = false;

	constructor(
		private configService: ConfigService,
		private titleService: Title,
		private authService: AuthService,
		private sidebarService: SidebarService,
		private config: PrimeNGConfig,
		private translateService: TranslateService,
		private primengConfig: PrimeNGConfig,
		private deviceDetectorService: DeviceDetectorService
	) {
		const appConfig = this.configService.getAppConfig()
		this.translateService.setDefaultLang(appConfig.locale.defaultLanguage);
		this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
		this.translateService.get(appConfig.pageTitle).subscribe((res) => this.titleService.setTitle(res));
	}

	ngOnInit() {
		this.isMobile = this.deviceDetectorService.isMobile();
		if (this.isMobile) {
			this.displaySidebar = false;
		}
		this.sidebarService.sidebarShowHide.subscribe(show => this.displaySidebar = show)
		this.primengConfig.ripple = true;
		this.authService.autoLogin();

		if (environment.production) {
			localStorage.removeItem('dateFilter');
			localStorage.removeItem('filterState');
			localStorage.removeItem('tableState');
		}
		this.sidebarService.sidebarAbout.subscribe(show => this.displayAbout = show);
	}

	showHideSidebar(displaySidebar: boolean) {
		this.displaySidebar = displaySidebar;
	}

}
