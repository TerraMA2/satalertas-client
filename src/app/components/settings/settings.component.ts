import { Component, OnInit } from '@angular/core';
import {SidebarService} from '../../services/sidebar.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(
    private sidebarService: SidebarService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.sidebarService.sidebarReload.next('settings');
  }

  backClicked() {
    this.location.back();
    this.sidebarService.sidebarReload.next();
  }

}
