import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../../services/config.service';

import { Group } from 'src/app/models/group.model';

import { Layer } from 'src/app/models/layer.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  sidebarItems: Group[] = [];

  sidebarConfig;

  logoPath: string;
  logoLink: string;

  constructor(
    private configService: ConfigService
  ) {}

  ngOnInit() {
    this.sidebarConfig = this.configService.getConfig('sidebar');
    this.logoPath = this.sidebarConfig.logoPath;
    this.logoLink = this.sidebarConfig.logoLink;
    this.setSidebarItems();
  }

  setSidebarItems() {
    this.sidebarConfig.sidebarItems.forEach(sidebarItem => {
      const group = new Group(
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
      group.children = layerChildren;
      this.sidebarItems.push(group);
    });
  }

}
