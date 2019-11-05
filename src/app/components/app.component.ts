import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';

import { ConfigService } from '../services/config.service';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private appConfig;

  displaySidebar = true;

  isAuthenticated = false;

  constructor(
    private configService: ConfigService,
    private titleService: Title,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.autoLogin();

    this.appConfig = this.configService.getAppConfig();
    this.titleService.setTitle(`${this.appConfig.mainApplication} | ${this.appConfig.headerTitle}`);
  }

  showHideSidebar(displaySidebar: boolean) {
    this.displaySidebar = displaySidebar;
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

}
