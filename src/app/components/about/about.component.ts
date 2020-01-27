import { Component, OnInit, Input } from '@angular/core';

import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  @Input() displayAbout;

  constructor(
    private sidebarService: SidebarService
  ) { }

  ngOnInit() {
  }

  closeAbout() {
    this.sidebarService.sidebarAbout.next();
  }

}
