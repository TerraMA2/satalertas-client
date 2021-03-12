import {Component, Input, OnInit} from '@angular/core';

import {SidebarService} from 'src/app/services/sidebar.service';

import {TableService} from 'src/app/services/table.service';

import {Layer} from 'src/app/models/layer.model';

import {MapService} from '../../../../../services/map.service';

import {LayerGroup} from '../../../../../models/layer-group.model';

import {AuthService} from '../../../../../services/auth.service';

import {User} from '../../../../../models/user.model';

@Component({
    selector: 'app-sidebar-layer',
    templateUrl: './sidebar-layer.component.html',
    styleUrls: ['./sidebar-layer.component.css']
})
export class SidebarLayerComponent implements OnInit {

    @Input() layer: Layer;

    @Input() parentSwitchChecked;

    primaryRadio: string;

    @Input() isLayerGroupOpened;

    isToolsOpened = false;

    @Input() displayControls = true;

    @Input() displayChild = false;

    isSelected = false;
    loggedUser: User = null;
    disableTool = {};

    constructor(
        private sidebarService: SidebarService,
        private mapService: MapService,
        private tableService: TableService,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.authService.user.subscribe((user) => {
            if (!user || !user.administrator) {
                this.disableTool['export'] = true;
            } else {
                this.disableTool= {};
            }
        })
        this.sidebarService.sidebarLayerSwitchSelect.subscribe((layers: Layer[]) => {
            this.changeState(layers, true);
        });

        this.sidebarService.sidebarLayerSwitchDeselect.subscribe((layers: Layer[]) => {
            this.changeState(layers, false);
        });

        this.sidebarService.sidebarLayerGroupRadioDeselect.subscribe((layerGroup: LayerGroup) => {
            layerGroup.children.forEach((layer: Layer) => {
                if (layer.value === this.layer.value && this.layer.isPrimary) {
                    this.mapService.clearMarkers.next();
                    this.primaryRadio = null;
                }
            });
        });

        this.isSelected = this.layer.isDisabled ? null : this.parentSwitchChecked;
    }

    onChildClicked() {
        if (!this.isToolsOpened && !this.isSelected) {
            this.selectItem();
            this.isSelected = true;
        }
        this.isToolsOpened = !this.isToolsOpened;
    }

    onChildSwitchChanged(event) {
        if (event.checked) {
            this.selectItem();
        } else {
            this.deselectItem();
        }
    }

    selectItem() {
        this.tableService.unloadTableData.next();
        this.sidebarService.sidebarLayerSelect.next(this.layer);
    }

    deselectItem() {
        this.sidebarService.sidebarLayerDeselect.next(this.layer);
        this.tableService.unloadTableData.next(this.layer);
        if (this.layer.isPrimary && this.primaryRadio) {
            this.sidebarService.sidebarItemRadioDeselect.next(this.layer);
            this.primaryRadio = null;
        }
        this.isToolsOpened = false;

        this.mapService.layerToolClose.next(this.layer);
    }

    onChildRadioClicked() {
        this.selectItem();
        this.isSelected = true;
        this.sidebarService.sidebarItemRadioSelect.next(this.layer);
    }

    onToolClicked(name) {
        this[name + 'Tool']();
    }

    exportTool() {
        const layer = this.layer;
        this.mapService.layerToolOpen.next({layer, toolName: 'export'});
    }

    descriptionTool() {
        const layer = this.layer;
        this.mapService.layerToolOpen.next({layer, toolName: 'description'});
    }

    opacityTool() {
        const layer = this.layer;
        this.mapService.layerToolOpen.next({layer, toolName: 'opacity'});
    }

    sliderTool() {
        const layer = this.layer;
        this.mapService.layerToolOpen.next({layer, toolName: 'slider'});
    }

    calendarTool() {
        const layer = this.layer;
        this.mapService.layerToolOpen.next({layer, toolName: 'calendar'});
    }

    extentTool() {
        const layer = this.layer;
        this.mapService.layerExtent.next(layer);
    }

    trackById(index, item) {
        return item.id;
    }

    private changeState(children: Layer[], selected) {
        children.forEach((layer: Layer) => {
            if (layer.value === this.layer.value) {
                this.isSelected = selected;
            }
        });
    }
    consLog(param) {
        console.log(param);
    }

}
