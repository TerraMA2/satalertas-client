import { Component, OnInit} from '@angular/core';

import { ConfigService } from '../../services/config.service';

import { LayerGroup } from 'src/app/models/layer-group.model';

import { Layer } from 'src/app/models/layer.model';

import { SidebarService } from 'src/app/services/sidebar.service';

import { MapService } from 'src/app/services/map.service';

import { SidebarItem } from 'src/app/models/sidebar-item.model';

import { HTTPService } from 'src/app/services/http.service';

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
    private hTTPService: HTTPService,
    private mapService: MapService
  ) {}

  ngOnInit() {
    this.sidebarConfig = this.configService.getSidebarConfig();
    this.logoPath = this.sidebarConfig.logoPath;
    this.logoLink = this.sidebarConfig.logoLink;
    this.setItems();
    this.sidebarService.sidebarReload.subscribe(() => {
      this.setSidebarLayers();
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
    this.sidebarLayers = this.sidebarConfig.sidebarLayers;
    // this.hTTPService.get('http://localhost:3200/view/get').subscribe((layers: LayerGroup[]) => {
      // this.sidebarLayers = layers;
    this.sidebarLayerGroups = [];
    this.sidebarLayers.forEach(sidebarLayer => {
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
            sidebarLayerChild.isChild,
            sidebarLayerChild.filter,
            sidebarLayerChild.layerData,
            sidebarLayerChild.legend,
            sidebarLayerChild.popupTitle,
            sidebarLayerChild.infoColumns,
            sidebarLayerChild.tools,
            sidebarLayerChild.markerSelected
          );
          layerChildren.push(layer);
        });
      }
      const layerGroup = new LayerGroup(
        sidebarLayer.cod,
        sidebarLayer.label,
        sidebarLayer.parent,
        sidebarLayer.isPrivate,
        sidebarLayer.icon,
        sidebarLayer.viewGraph,
        sidebarLayer.activeArea,
        layerChildren
      );
      this.sidebarLayerGroups.push(layerGroup);
    });
    // });
  }

  getSidebarItem(sidebarItem) {
    return new SidebarItem(
      sidebarItem.label,
      sidebarItem.link,
      sidebarItem.method,
      sidebarItem.value,
      sidebarItem.icon,
      sidebarItem.separator
    );
  }

}
