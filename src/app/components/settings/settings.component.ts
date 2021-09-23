import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { User } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';

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
		private navigationService: NavigationService,
		private activatedRoute: ActivatedRoute
	) {
	}

	ngOnInit(): void {
		this.activatedRoute.data.subscribe(data => this.loggedUser = data['user']);
		this.sidebarService.sidebarReload.next('settings');
		this.navigationService.settingsIn.next(true)
	}

	ngOnDestroy() {
		this.navigationService.settingsIn.next(false);
	}

}
