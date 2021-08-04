import {Component, OnInit} from '@angular/core';
import {SidebarService} from '../../services/sidebar.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  constructor(
    private sidebarService: SidebarService,
  ) { }

  ngOnInit(): void {
    this.sidebarService.sidebarLayerShowHide.next(false);
    this.sidebarService.sidebarReload.next();
  }

}
