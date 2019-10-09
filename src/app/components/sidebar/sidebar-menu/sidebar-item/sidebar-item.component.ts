import { Component, OnInit, Input } from '@angular/core';

import { TableService } from 'src/app/services/table.service';

import { SidebarService } from 'src/app/services/sidebar.service';

import { AuthService } from 'src/app/services/auth.service';

import { Layer } from 'src/app/models/layer.model';

import { LayerGroup } from 'src/app/models/layer-group.model';

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.css']
})
export class SidebarItemComponent implements OnInit {

  @Input() sidebarItem: LayerGroup;

  @Input() childrenItems: Layer[];

  parentSwitchChecked = false;

  isParentOpened = false;

  loggedUserName;

  isAuthenticated = false;

  constructor(
    private sidebarService: SidebarService,
    private tableService: TableService,
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
      } else if (event.checked === false) {
        this.sidebarService.sidebarItemUnselect.next(child);
        this.tableService.unloadTableData.next(child);
      }
    });
    this.parentSwitchChecked = !this.parentSwitchChecked;
  }
}
