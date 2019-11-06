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

  @Input() layer: Layer;

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
      this.deselectItem();
    }
  }
  selectItem() {
    this.tableService.unloadTableData.next();
    this.sidebarService.sidebarLayerSelect.next(this.layer);
  }

  deselectItem() {
    this.sidebarService.sidebarLayerDeselect.next(this.layer);
    this.tableService.unloadTableData.next(this.layer);
    if (this.layer.isPrimary && this.primaryRadio) {
      this.sidebarService.sidebarItemRadioDeselect.next(this.layer);
      this.primaryRadio = '';
    }
  }

  onChildRadioClicked() {
    if (!this.parentSwitchChecked) {
      this.selectItem();
      this.parentSwitchChecked = true;
    }
    this.sidebarService.sidebarItemRadioSelect.next(this.layer);
  }

  onToolClicked(name) {
    this[name]();
  }

}
