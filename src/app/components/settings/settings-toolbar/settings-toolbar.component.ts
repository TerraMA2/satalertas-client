import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {SidebarService} from '../../../services/sidebar.service';

@Component({
  selector: 'app-settings-toolbar',
  templateUrl: './settings-toolbar.component.html',
  styleUrls: ['./settings-toolbar.component.css']
})
export class SettingsToolbarComponent implements OnInit {

  constructor(
    private sidebarService: SidebarService,
    private location: Location
  ) { }

  ngOnInit(): void {
  }

  backClicked() {
    this.location.back();
    this.sidebarService.sidebarReload.next();
  }

}
