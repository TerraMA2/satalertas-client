import { Component, Input, OnInit} from '@angular/core';

import { ConfigService } from '../../services/config.service';

import { LayerGroup } from 'src/app/models/layer-group.model';

import { Layer } from 'src/app/models/layer.model';

import { SidebarService } from 'src/app/services/sidebar.service';

import { MapService } from 'src/app/services/map.service';

import { SidebarItem } from 'src/app/models/sidebar-item.model';

import { SidebarGroup } from 'src/app/models/sidebar-group.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() displayFilterControl = true;

  sidebarGroups: SidebarGroup[] = [];

  sidebarItems: SidebarItem[] = [];

  sidebarLayerGroups: LayerGroup[] = [];

  sidebarConfig;

  logoPath: string;
  logoLink: string;

  displayFilter = false;

  constructor(
    private configService: ConfigService,
    private sidebarService: SidebarService,
    private mapService: MapService
  ) {}

  ngOnInit() {
    this.sidebarConfig = this.configService.getSidebarConfig();
    this.logoPath = this.sidebarConfig.logoPath;
    this.logoLink = this.sidebarConfig.logoLink;
    this.setSidebarItems();
    this.sidebarService.sidebarReload.subscribe(() => {
      this.setSidebarItems();
      this.mapService.clearMap.next();
    });
  }

  setSidebarItems() {
    this.sidebarItems = [];
    this.sidebarConfig.sidebarItems.forEach(sbItem => {
      const sidebarItem = new SidebarItem(
        sbItem.label,
        sbItem.link,
        sbItem.method,
        sbItem.value,
        sbItem.icon
      );
      this.sidebarItems.push(sidebarItem);
    });

    this.sidebarLayerGroups = [];
    this.sidebarConfig.sidebarLayers.forEach(sidebarLayer => {
      const layerGroup = new LayerGroup(
        sidebarLayer.cod,
        sidebarLayer.label,
        sidebarLayer.parent,
        sidebarLayer.isPrivate,
        sidebarLayer.icon,
        sidebarLayer.viewGraph,
        sidebarLayer.activeArea
      );

      const layerChildren: Layer[] = [];

      const children = sidebarLayer.children;
      if (children) {
        sidebarLayer.children.forEach(sidebarLayerChild => {
          const layer = new Layer(
            sidebarLayerChild.cod,
            sidebarLayerChild.codgroup,
            sidebarLayerChild.label,
            sidebarLayerChild.shortLabel,
            sidebarLayerChild.value,
            sidebarLayerChild.dateColumn,
            sidebarLayerChild.geomColumn,
            sidebarLayerChild.areaColumn,
            sidebarLayerChild.carRegisterColumn,
            sidebarLayerChild.classNameColumn,
            sidebarLayerChild.type,
            sidebarLayerChild.isPrivate,
            sidebarLayerChild.isPrimary,
            sidebarLayerChild.layerData,
            sidebarLayerChild.legend,
            sidebarLayerChild.popupTitle,
            sidebarLayerChild.tools
          );
          layerChildren.push(layer);
        });
      }
      layerGroup.children = layerChildren;
      this.sidebarLayerGroups.push(layerGroup);
    });
  }

}
