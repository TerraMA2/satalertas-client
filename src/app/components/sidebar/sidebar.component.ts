import {AfterViewInit, Component, Input, OnInit} from '@angular/core';

import { ConfigService } from '../../services/config.service';

import { LayerGroup } from 'src/app/models/layer-group.model';

import { Layer } from 'src/app/models/layer.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  @Input() displayFilterControl = true;

  sidebarItems: LayerGroup[] = [];

  sidebarConfig;

  logoPath: string;
  logoLink: string;

  displayFilter = false;

  constructor(
    private configService: ConfigService
  ) {}

  ngOnInit() {
    this.sidebarConfig = this.configService.getConfig('sidebar');
    this.logoPath = this.sidebarConfig.logoPath;
    this.logoLink = this.sidebarConfig.logoLink;
    this.setSidebarItems();
  }

  ngAfterViewInit() {
    if (this.displayFilterControl) {
      this.setFilterControl();
    }
  }

  setFilterControl() {
    const Filter = L.Control.extend({
      onAdd: () => {
        const div = L.DomUtil.create('div');
        div.innerHTML = `
          <div id="filterBtn" class="leaflet-control-layers leaflet-custom-icon" title="Filtro">
            <a><i class='fas fa-filter'></i></a>
          </div>`;
        return div;
      }
    });
    //
    // new Filter({ position: 'topleft' }).addTo(this.map);

    this.setFilterControlEvent();
  }

  setFilterControlEvent() {
    L.DomEvent.on(L.DomUtil.get('filterBtn'), 'dblclick', L.DomEvent.stopPropagation);
    document.querySelector('#filterBtn').addEventListener('click', () => this.displayFilter = !this.displayFilter);
  }

  setSidebarItems() {
    this.sidebarConfig.sidebarItems.forEach(sidebarItem => {
      const layerGroup = new LayerGroup(
        sidebarItem.label,
        sidebarItem.parent,
        sidebarItem.link
      );

      const layerChildren: Layer[] = [];

      const children = sidebarItem.children;
      const link = sidebarItem.link;
      if (children && !link) {
        sidebarItem.children.forEach(sidebarItemChild => {
          const layer = new Layer(
            sidebarItemChild.label,
            sidebarItemChild.shortLabel,
            sidebarItemChild.value,
            sidebarItemChild.defaultDateInterval,
            sidebarItemChild.dateColumn,
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
