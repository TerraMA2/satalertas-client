import {Component, Input, OnInit} from '@angular/core';

import {SidebarService} from 'src/app/services/sidebar.service';
import {ConfigService} from '../../services/config.service';
import {AboutOfferings} from '../../models/about-offerings.model';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    @Input() displayAbout;
    public title: string;
    public version: string;
    public date: string;
    public description: string;
    public offerings: AboutOfferings[];
    public terrama2Version: string;
    public terralibVersion: string;

    constructor(
        private sidebarService: SidebarService,
        private configService: ConfigService
    ) {
    }

    ngOnInit() {
        const aboutConfig = this.configService.getAboutConfig();
        this.title = aboutConfig.title;
        this.version = aboutConfig.version;
        this.date = aboutConfig.date;
        this.description = aboutConfig.description;
        this.offerings = aboutConfig.offerings;
        this.terrama2Version = aboutConfig.terrama2Version;
        this.terralibVersion = aboutConfig.terralibVersion;
    }

    onHide() {
        this.sidebarService.sidebarAbout.next(false);
    }

    closeAbout() {
        this.sidebarService.sidebarAbout.next(false);
    }

}
