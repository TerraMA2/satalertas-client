import { Component, OnInit, Input } from '@angular/core';

import { TableService } from 'src/app/services/table.service';

import { SidebarService } from 'src/app/services/sidebar.service';

import { Layer } from 'src/app/models/layer.model';

import { MapService } from 'src/app/services/map.service';

import { AuthService } from 'src/app/services/auth.service';

import { SidebarItem } from 'src/app/models/sidebar-item.model';

@Component({
  selector: 'app-sidebar-layer-group',
  templateUrl: './sidebar-layer-group.component.html',
  styleUrls: ['./sidebar-layer-group.component.css']
})
export class SidebarLayerGroupComponent implements OnInit {

  @Input() sidebarItem: SidebarItem;

  @Input() childrenItems: Layer[];

  parentSwitchChecked = false;

  isLayerGroupOpened = false;

  isAuthenticated = false;

  constructor(
    private sidebarService: SidebarService,
    private tableService: TableService,
    private mapService: MapService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.user.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    });
  }

  openReportTable() {
    this.sidebarService.sidebarReload.next();
    this.mapService.reportTable.next(this.sidebarItem);
  }

  onParentSwitchChanged(event) {
    this.childrenItems.forEach(child => {
      if (event.checked === true) {
        this.sidebarService.sidebarItemSelect.next(child);
      } else if (event.checked === false) {
        this.sidebarService.sidebarItemUnselect.next(child);
        this.tableService.unloadTableData.next(child);
      }
    });
    this.parentSwitchChecked = !this.parentSwitchChecked;
  }

  onLayerGroupClicked() {
    this.isLayerGroupOpened = !this.isLayerGroupOpened;
  }

}
