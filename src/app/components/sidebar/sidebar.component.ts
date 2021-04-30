import {Component, OnInit} from '@angular/core';

import {ConfigService} from '../../services/config.service';

import {LayerGroup} from 'src/app/models/layer-group.model';

import {Layer} from 'src/app/models/layer.model';

import {SidebarService} from 'src/app/services/sidebar.service';

import {MapService} from 'src/app/services/map.service';

import {SidebarItem} from 'src/app/models/sidebar-item.model';

import {Response} from '../../models/response.model';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

    sidebarItems: SidebarItem[] = [];

    sidebarLayerGroups: LayerGroup[] = [];

    sidebarLayers: LayerGroup[] = [];

    sidebarConfig;

    logoPath: string;
    logoLink: string;

    constructor(
        private configService: ConfigService,
        private sidebarService: SidebarService,
        private mapService: MapService
    ) {
    }

    ngOnInit() {
        this.sidebarConfig = this.configService.getSidebarConfig();
        this.logoPath = this.sidebarConfig.logoPath;
        this.logoLink = this.sidebarConfig.logoLink;
        this.setItems();
        this.sidebarService.sidebarReload.subscribe((type) => {
            if (type === 'settings') {
                this.sidebarConfig = this.configService.getSidebarSettingsConfig();
                this.setSidebarItems();
                this.sidebarLayerGroups = [];
            } else {
                this.sidebarConfig = this.configService.getSidebarConfig();
                this.setItems();
            }
            this.mapService.clearMap.next();
        });
    }

    setItems() {
        this.setSidebarItems();
        this.setSidebarLayers();
    }

    setSidebarItems() {
        if (!this.sidebarConfig.sidebarItems) {
            return;
        }
        this.sidebarItems = [];
        this.sidebarConfig.sidebarItems.forEach(sbItem => {
            const sidebarItem = this.getSidebarItem(sbItem);
            this.sidebarItems.push(sidebarItem);
        });
    }

    setSidebarLayers() {
        this.configService.getSidebarConfigurationDynamically().then((layers: Response) => {
            this.sidebarLayers = layers.data;
            this.sidebarLayerGroups = [];
            if (this.sidebarLayers) {
                this.sidebarLayers.forEach(sidebarLayer => {
                    const layerChildren: Layer[] = [];
                    let children = null;
                    if (sidebarLayer) {
                        children = sidebarLayer.children;
                    }
                    if (children) {
                        sidebarLayer.children.forEach((sidebarLayerChild, index) => {
                            let layer;
                            if (!sidebarLayerChild.isHidden) {
                                layer = new Layer(
                                    sidebarLayerChild.cod,
                                    sidebarLayerChild.codgroup,
                                    sidebarLayerChild.label,
                                    sidebarLayerChild.shortLabel,
                                    sidebarLayerChild.description,
                                    sidebarLayerChild.value,
                                    sidebarLayerChild.dateColumn,
                                    sidebarLayerChild.geomColumn,
                                    sidebarLayerChild.areaColumn,
                                    sidebarLayerChild.carRegisterColumn,
                                    sidebarLayerChild.classNameColumn,
                                    sidebarLayerChild.type,
                                    sidebarLayerChild.showMarker,
                                    sidebarLayerChild.isPrivate,
                                    sidebarLayerChild.isPrimary,
                                    sidebarLayerChild.isChild,
                                    sidebarLayerChild.isAlert,
                                    sidebarLayerChild.filter,
                                    sidebarLayerChild.layerData,
                                    sidebarLayerChild.legend,
                                    sidebarLayerChild.popupTitle,
                                    sidebarLayerChild.infoColumns,
                                    sidebarLayerChild.isHidden,
                                    sidebarLayerChild.isDisabled,
                                    sidebarLayerChild.tools,
                                    sidebarLayerChild.markerSelected,
                                    sidebarLayerChild.tableOwner,
                                    sidebarLayerChild.tableName
                                );
                                layerChildren.push(layer);
                            }
                        });
                    }
                    const layerGroup = new LayerGroup(
                        sidebarLayer.cod,
                        sidebarLayer.label,
                        sidebarLayer.parent,
                        sidebarLayer.isPrivate,
                        sidebarLayer.icon,
                        sidebarLayer.view_graph,
                        sidebarLayer.activeArea,
                        layerChildren,
                        sidebarLayer.tableOwner
                    );
                    this.sidebarLayerGroups.push(layerGroup);
                });
            }
        });
    }

    getSidebarItem(sidebarItem) {
        return new SidebarItem(
            sidebarItem.label,
            sidebarItem.link,
            sidebarItem.method,
            sidebarItem.dataUrl,
            sidebarItem.value,
            sidebarItem.icon,
            sidebarItem.separator
        );
    }

}
