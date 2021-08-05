import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
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
		private navigationService: NavigationService
	) {
	}

	ngOnInit(): void {
		this.sidebarService.sidebarReload.next('settings');
		this.authService.user.subscribe(user => {
			this.loggedUser = user;
			if (!user || !user.administrator) {
				this.navigationService.back();
				this.messageService.add({ severity: 'error', summary: 'Atenção!', detail: 'Usuário não autenticado.' });
			}
		});
	}

}
