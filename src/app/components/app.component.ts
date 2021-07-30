import {Component, OnInit} from '@angular/core';

import {Title} from '@angular/platform-browser';

import {ConfigService} from '../services/config.service';

import {AuthService} from '../services/auth.service';

import {environment} from 'src/environments/environment';

import {SidebarService} from '../services/sidebar.service';
import {PrimeNGConfig} from 'primeng/api';

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
        private config: PrimeNGConfig
    ) {
    }

    ngOnInit() {
        const filterLocale = this.configService.getFilterConfig('locale');
        this.config.setTranslation(filterLocale);
        this.authService.autoLogin();

        if (environment.production) {
            localStorage.removeItem('dateFilter');
            localStorage.removeItem('mapState');
            localStorage.removeItem('filterList');
        }

        const pageTitle = this.configService.getAppConfig('pageTitle');
        this.titleService.setTitle(pageTitle);

        this.sidebarService.sidebarAbout.subscribe(show => this.displayAbout = show);
    }

    showHideSidebar(displaySidebar: boolean) {
        this.displaySidebar = displaySidebar;
    }

}
