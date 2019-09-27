import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {

  @Input() sidebarItems;

  constructor() { }

  ngOnInit() {
  }

}
