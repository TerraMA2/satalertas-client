import { Component, OnInit, Input } from '@angular/core';

import { SidebarService } from 'src/app/services/sidebar.service';

import { TableService } from 'src/app/services/table.service';

import { Layer } from 'src/app/models/layer.model';

@Component({
  selector: 'app-sidebar-item-child',
  templateUrl: './sidebar-item-child.component.html',
  styleUrls: ['./sidebar-item-child.component.css']
})
export class SidebarItemChildComponent implements OnInit {

  @Input() child: Layer;

  @Input() parentSwitchChecked;

  primaryRadio = false;

  @Input() isParentOpened;

  isToolsOpened = false;

  @Input() displayControls = true;

  constructor(
    private sidebarService: SidebarService,
    private tableService: TableService
  ) { }

  ngOnInit() {
  }

  onChildClicked() {
    this.isToolsOpened = !this.isToolsOpened;
  }

  onChildSwitchChanged(event) {
    if (event.checked === true) {
      this.selectItem();
    } else if (event.checked === false) {
      this.unSelectItem();
    }
  }
  selectItem() {
    this.sidebarService.sidebarItemSelect.next(this.child);
    this.tableService.loadTableData.next(this.child);
  }

  unSelectItem() {
    this.sidebarService.sidebarItemUnselect.next(this.child);
    this.tableService.unloadTableData.next(this.child);
    if (this.child.isPrimary) {
      this.sidebarService.sidebarItemRadioUnselect.next(this.child);
    }
    this.primaryRadio = false;
  }

  onChildRadioClicked() {
    if (!this.parentSwitchChecked) {
      this.selectItem();
      this.parentSwitchChecked = true;
    }
    this.sidebarService.sidebarItemRadioSelect.next(this.child);
  }

  onToolClicked(name) {
    switch (name) {
      case 'info':
        break;
      case 'export':
        break;
      case 'temporalDimension':
        break;
      case 'calendar':
        break;
      case 'opacity':
        break;
      default:
        break;
    }
  }

}
