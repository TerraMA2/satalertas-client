import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NavigationService } from '../../services/navigation.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

	loggedUser: User = null;

	constructor(
		private sidebarService: SidebarService,
		private location: Location,
		private authService: AuthService,
		private router: Router,
		private messageService: MessageService,
		private navigationService: NavigationService,
		private activatedRoute: ActivatedRoute
	) {
	}

	ngOnInit(): void {
		this.activatedRoute.data.subscribe(data => this.loggedUser = data['user']);
		this.sidebarService.sidebarReload.next('settings');
	}

}
