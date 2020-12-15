import {Component, Input, OnInit} from '@angular/core';

import {AuthService} from 'src/app/services/auth.service';

import {SidebarItem} from 'src/app/models/sidebar-item.model';

import {LayerGroup} from 'src/app/models/layer-group.model';

import {SidebarService} from 'src/app/services/sidebar.service';

@Component({
    selector: 'app-sidebar-menu',
    templateUrl: './sidebar-menu.component.html',
    styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {

    @Input() sidebarItems: SidebarItem[];

    @Input() sidebarLayerGroups: LayerGroup[];

    isMapShowing = false;

    isAuthenticated = false;

    constructor(
        private authService: AuthService,
        private sidebarService: SidebarService
    ) {
    }

    ngOnInit() {
        this.authService.user.subscribe(user => this.isAuthenticated = !!user);

        this.sidebarService.sidebarLayerShowHide.subscribe(showHide => this.isMapShowing = showHide);
    }

    trackById(index, item) {
        return item.id;
    }

}
