import { Component, OnInit, Input } from '@angular/core';

import { SidebarService } from 'src/app/services/sidebar.service';

import { TableService } from 'src/app/services/table.service';

import { Layer } from 'src/app/models/layer.model';

import { Router } from '@angular/router';

import { FilterService } from '../../../../../services/filter.service';
import {MapService} from '../../../../../services/map.service';

@Component({
  selector: 'app-sidebar-item-child',
  templateUrl: './sidebar-item-child.component.html',
  styleUrls: ['./sidebar-item-child.component.css']
})
export class SidebarItemChildComponent implements OnInit {

  @Input() child: Layer;

  @Input() parentSwitchChecked;

  primaryRadio: string;

  @Input() isParentOpened;

  isToolsOpened = false;

  @Input() displayControls = true;

  @Input() displayChild = false;

  constructor(
    private sidebarService: SidebarService,
    private tableService: TableService,
    private router: Router,
    private filterService: FilterService
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
    if (this.router.url !== '/map') {
      this.router.navigate(['/map']);
      return;
    }
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
    switch (name) {
      case 'info':
        break;
      case 'export':
        break;
      case 'temporalDimension':
        break;
      case 'filter':
        this.filterService.displayFilter.next(this.child);
        break;
      case 'opacity':
        break;
      default:
        break;
    }
  }

}
