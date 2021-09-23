import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { User } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../../services/settings.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

	loggedUser: User = null;

	constructor(
		private sidebarService: SidebarService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private settingService: SettingsService
	) {
	}

	ngOnInit(): void {
		this.activatedRoute.data.subscribe(data => this.loggedUser = data['user']);
		this.sidebarService.sidebarReload.next('settings');
		this.settingService.settingsIn.next(true)
	}

	ngOnDestroy() {
		this.settingService.settingsIn.next(false);
	}

}
