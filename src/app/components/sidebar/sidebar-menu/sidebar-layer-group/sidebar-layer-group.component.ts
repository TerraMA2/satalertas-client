import {Component, Input, OnInit} from '@angular/core';

import {SidebarService} from 'src/app/services/sidebar.service';

import {Layer} from 'src/app/models/layer.model';

import {AuthService} from 'src/app/services/auth.service';

import {LayerGroup} from 'src/app/models/layer-group.model';

@Component({
    selector: 'app-sidebar-layer-group',
    templateUrl: './sidebar-layer-group.component.html',
    styleUrls: ['./sidebar-layer-group.component.css']
})
export class SidebarLayerGroupComponent implements OnInit {

    @Input() sidebarLayerGroup: LayerGroup;

    @Input() sidebarLayers: Layer[];

    switchChecked = false;

    isLayerGroupOpened = false;

    isAuthenticated = false;

    constructor(
        private sidebarService: SidebarService,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.authService.user.subscribe(user => this.isAuthenticated = !!user);
    }

    onSwitchChanged(event) {
        if (event.checked === true) {
            this.sidebarService.sidebarLayerGroupSelect.next(this.sidebarLayerGroup);
        } else if (event.checked === false) {
            this.sidebarService.sidebarLayerGroupDeselect.next(this.sidebarLayerGroup);
            this.sidebarService.sidebarLayerGroupRadioDeselect.next(this.sidebarLayerGroup);
        }
        this.switchChecked = !this.switchChecked;
    }

    onLayerGroupClicked() {
        this.isLayerGroupOpened = !this.isLayerGroupOpened;
    }

    trackById(index, item) {
        return item.id;
    }

}
