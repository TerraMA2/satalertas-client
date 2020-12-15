import {Component, OnInit} from '@angular/core';

import {SidebarService} from 'src/app/services/sidebar.service';

@Component({
    selector: 'app-sidebar-footer',
    templateUrl: './sidebar-footer.component.html',
    styleUrls: ['./sidebar-footer.component.css']
})
export class SidebarFooterComponent implements OnInit {

    constructor(
        private sidebarService: SidebarService
    ) {
    }

    ngOnInit() {
    }

    openAbout() {
        this.sidebarService.sidebarAbout.next(true);
    }

}
