import { Component, OnInit, Input } from '@angular/core';

import { SidebarItem } from 'src/app/models/sidebar-item.model';

import { Router } from '@angular/router';

import { SidebarService } from 'src/app/services/sidebar.service';

import { MapService } from 'src/app/services/map.service';

import { TableService } from 'src/app/services/table.service';

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.css']
})
export class SidebarItemComponent implements OnInit {

  @Input() sidebarItem: SidebarItem;

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    private mapService: MapService,
    private tableService: TableService
  ) { }

  ngOnInit() {
  }

  onSidebarItemClicked() {
    if (this.sidebarItem.link) {
      this.router.navigateByUrl(this.sidebarItem.link);
    } else if (this.sidebarItem.method) {
      this[this.sidebarItem.method]();
    }
  }

  generateReport() {
    this.mapService.reportTable.next();
    this.tableService.loadReportTableData.next();
    this.sidebarService.sidebarReload.next();
  }

}
