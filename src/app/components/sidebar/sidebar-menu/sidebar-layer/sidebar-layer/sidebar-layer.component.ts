import { Component, OnInit, Input } from '@angular/core';

import { SidebarService } from 'src/app/services/sidebar.service';

import { TableService } from 'src/app/services/table.service';

import { Layer } from 'src/app/models/layer.model';

@Component({
  selector: 'app-sidebar-layer',
  templateUrl: './sidebar-layer.component.html',
  styleUrls: ['./sidebar-layer.component.css']
})
export class SidebarLayerComponent implements OnInit {

  @Input() child: Layer;

  @Input() parentSwitchChecked;

  primaryRadio: string;

  @Input() isLayerGroupOpened;

  isToolsOpened = false;

  @Input() displayControls = true;

  @Input() displayChild = false;

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
    if (event.checked) {
      this.selectItem();
    } else {
      this.unSelectItem();
    }
  }
  selectItem() {
    this.tableService.unloadTableData.next();
    this.sidebarService.sidebarItemSelect.next(this.child);
  }

  unSelectItem() {
    this.sidebarService.sidebarItemUnselect.next(this.child);
    this.tableService.unloadTableData.next(this.child);
    if (this.child.isPrimary && this.primaryRadio) {
      this.sidebarService.sidebarItemRadioUnselect.next(this.child);
      this.primaryRadio = '';
    }
  }

  onChildRadioClicked() {
    if (!this.parentSwitchChecked) {
      this.selectItem();
      this.parentSwitchChecked = true;
    }
    this.sidebarService.sidebarItemRadioSelect.next(this.child);
  }

  onToolClicked(name) {
    this[name]();
  }

}
