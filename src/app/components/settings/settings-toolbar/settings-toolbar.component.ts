import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-settings-toolbar',
  templateUrl: './settings-toolbar.component.html',
  styleUrls: ['./settings-toolbar.component.css']
})
export class SettingsToolbarComponent implements OnInit {

  constructor(
    // private sidebarService: SidebarService,
    // private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  backClicked() {
    this.router.navigateByUrl('/map');
    // this.location.back();
    // this.sidebarService.sidebarReload.next();
  }

}
