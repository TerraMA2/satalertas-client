import {Component, Input, OnInit} from '@angular/core';

import {SidebarService} from 'src/app/services/sidebar.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    @Input() displayAbout;

    constructor(
        private sidebarService: SidebarService
    ) {
    }

    ngOnInit() {
    }

    onHide() {
        this.sidebarService.sidebarAbout.next(false);
    }

    closeAbout() {
        this.sidebarService.sidebarAbout.next(false);
    }

}
