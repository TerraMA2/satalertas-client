import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';

import { ConfigService } from '../services/config.service';

import { AuthService } from '../services/auth.service';

import { environment } from 'src/environments/environment';

import { SidebarService } from '../services/sidebar.service';

import { PrimeNGConfig } from 'primeng/api';

import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	displayAbout = false;
	displaySidebar = true;

	constructor(
		private configService: ConfigService,
		private titleService: Title,
		private authService: AuthService,
		private sidebarService: SidebarService,
		private config: PrimeNGConfig,
		private translateService: TranslateService,
	) {
		this.translateService.setDefaultLang(this.configService.getAppConfig('locale').defaultLanguage);
		this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
		this.translateService.get('pageTitle').subscribe((res) => this.titleService.setTitle(res));
	}

	ngOnInit() {
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
