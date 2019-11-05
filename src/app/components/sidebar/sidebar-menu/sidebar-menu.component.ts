import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';

import { SidebarItem } from 'src/app/models/sidebar-item.model';

import { LayerGroup } from 'src/app/models/layer-group.model';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {

  @Input() sidebarItems: SidebarItem;

  @Input() sidebarLayerGroups: LayerGroup;

  isAuthenticated = false;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.user.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    });
  }

}
