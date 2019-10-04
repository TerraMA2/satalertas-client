import { Component, OnInit, EventEmitter, Output, OnDestroy, AfterViewInit } from '@angular/core';

import { ConfigService } from '../../services/config.service';

import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';

import { MessageService } from 'primeng/api';

import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() showHideSidebarClicked = new EventEmitter<boolean>();

  private userSub: Subscription;

  loggedUserName: string;

  isAuthenticated = false;

  displaySidebar = true;
  displayLogin = false;
  displayAbout = false;

  hasLogin = false;

  headerTitle: string;
  headerLogo: string;
  headerLogoLink: string;
  mainApplication: string;

  appConfig;

  // languages = [];

  // selectedLanguage;

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private messageService: MessageService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.appConfig = this.configService.getConfig('app');
    this.mainApplication = this.appConfig.mainApplication;
    this.headerTitle = this.appConfig.headerTitle;
    this.headerLogo = this.appConfig.headerLogo;
    this.headerLogoLink = this.appConfig.headerLogoLink;
    this.hasLogin = this.appConfig.hasLogin;

    // this.sidebarService.sidebarOpenClose.subscribe(show => this.showHideSidebar(show));

    // this.languages = this.configService.getConfig('languages');

    this.userSub = this.authService.user.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.loggedUserName = user.username;
      }
    });

  }

  showHideSidebar(show = null) {
    if (show) {
      this.displaySidebar = show;
    } else {
      this.displaySidebar = !this.displaySidebar;
    }
    this.showHideSidebarClicked.emit(this.displaySidebar);
  }

  onLoginClick() {
    this.displayLogin = true;
  }

  onCloseLoginClick(displayLogin: boolean) {
    this.displayLogin = displayLogin;
  }

  onLogoutClick() {
    this.authService.logout();
    this.isAuthenticated = false;
    this.loggedUserName = '';
    this.messageService.add({severity: 'success', summary: 'Logout', detail: 'Logout realizado com successo!'});
  }

  openAbout() {
    this.displayAbout = true;
  }

  closeAbout(displayAbout: boolean) {
    this.displayAbout = displayAbout;
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
