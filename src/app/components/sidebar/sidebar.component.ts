import { Component, Input, OnInit} from '@angular/core';

import { ConfigService } from '../../services/config.service';

import { LayerGroup } from 'src/app/models/layer-group.model';

import { Layer } from 'src/app/models/layer.model';

import * as L from 'leaflet';

import { SidebarService } from 'src/app/services/sidebar.service';

import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  sidebarItems: LayerGroup[] = [];

  sidebarConfig;

  logoPath: string;
  logoLink: string;

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

  setFilterControlEvent() {
    L.DomEvent.on(L.DomUtil.get('filterBtn'), 'dblclick', L.DomEvent.stopPropagation);
  }

  setSidebarItems() {
    this.sidebarItems = [];
    this.sidebarConfig.sidebarItems.forEach(sidebarItem => {
      const layerGroup = new LayerGroup(
        sidebarItem.cod,
        sidebarItem.label,
        sidebarItem.parent,
        sidebarItem.link,
        sidebarItem.isPrivate,
        sidebarItem.icon,
        sidebarItem.method,
        sidebarItem.value,
        sidebarItem.type,
        sidebarItem.carRegisterColumn,
        sidebarItem.layerData,
        sidebarItem.legend,
        sidebarItem.source,
        sidebarItem.limit
      );

      const layerChildren: Layer[] = [];

      const children = sidebarItem.children;
      const link = sidebarItem.link;
      if (children && !link) {
        sidebarItem.children.forEach(sidebarItemChild => {
          const layer = new Layer(
            sidebarItemChild.cod,
            sidebarItemChild.codgroup,
            sidebarItemChild.label,
            sidebarItemChild.shortLabel,
            sidebarItemChild.value,
            sidebarItemChild.dateColumn,
            sidebarItemChild.geomColumn,
            sidebarItemChild.areaColumn,
            sidebarItemChild.carRegisterColumn,
            sidebarItemChild.classNameColumn,
            sidebarItemChild.type,
            sidebarItemChild.isPrivate,
            sidebarItemChild.isPrimary,
            sidebarItemChild.layerData,
            sidebarItemChild.legend,
            sidebarItemChild.popupTitle,
            sidebarItemChild.tools
          );
          layerChildren.push(layer);
        });
      }
      layerGroup.children = layerChildren;
      this.sidebarItems.push(layerGroup);
    });
  }

  filterClick(event) {
    console.log(event);
  }

}
