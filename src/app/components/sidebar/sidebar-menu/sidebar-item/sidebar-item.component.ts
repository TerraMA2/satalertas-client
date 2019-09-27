import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { TableService } from 'src/app/services/table.service';

import { SidebarService } from 'src/app/services/sidebar.service';

import { MapService } from 'src/app/services/map.service';

import { AuthService } from 'src/app/services/auth.service';

import { Layer } from 'src/app/models/layer.model';

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.css']
})
export class SidebarItemComponent implements OnInit {

  @Input() sidebarItem: Layer;

  @Input() childrenItems: Layer[];

  parentSwitchChecked = false;

  isParentOpened = false;

  draggedItem;

  loggedUserName;

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
      }
    });
  }

  onParentClicked() {
    this.isParentOpened = !this.isParentOpened;
  }

  onParentSwitchChanged(event) {
    this.childrenItems.forEach(child => {
      if (event.checked === true) {
        this.sidebarService.sidebarItemSelect.next(child);
        this.tableService.loadTableData.next(child);
      } else if (event.checked === false) {
        this.sidebarService.sidebarItemUnselect.next(child);
        this.tableService.unloadTableData.next(child);
      }
    });
    this.parentSwitchChecked = !this.parentSwitchChecked;
  }

  dragStart(event, item) {
    this.draggedItem = item;
  }

  drop(event) {
    if (this.draggedItem) {
      const draggedItemIndex = this.childrenItems.findIndex(child => child.label === this.draggedItem.label);

      const itemDraggedTo = event.target.innerText;
      const itemDraggedToIndex = this.childrenItems.findIndex(child => child.label === itemDraggedTo);

      this.childrenItems.splice(draggedItemIndex, 1);
      this.childrenItems.splice(itemDraggedToIndex, 0, this.draggedItem);

      this.draggedItem = null;

      this.mapService.resetLayers.next(this.childrenItems);
    }
  }

  dragEnd(event) {
    this.draggedItem = null;
  }

}
