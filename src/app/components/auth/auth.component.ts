import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';

import { ConfigService } from 'src/app/services/config.service';

import { MessageService } from 'primeng/api';

import { NgForm } from '@angular/forms';

import { Response } from '../../models/response.model';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

	@Input() displayLogin;

	@Output() closeLoginClicked = new EventEmitter<boolean>();

	authConfig;

	isLoading = false;

	constructor(
		private configService: ConfigService,
		private authService: AuthService,
		private messageService: MessageService
	) {
	}

	ngOnInit() {
		this.authConfig = this.configService.getAuthConfig();
	}

	onCloseLoginClick() {
		this.closeLoginClicked.emit(false);
	}

	onLoginClicked(form: NgForm) {
		if (!form.valid) {
			return;
		}

		this.isLoading = true;

		this.authService.login(form.value).then((response: Response) => {
				const user = this.authService.handleAuthentication(response.data);
				const message = response.message;
				if (user) {
					this.authService.user.next(user);
					this.messageService.add({ severity: 'success', summary: '', detail: message });
					this.closeLoginClicked.emit(false);
				}
				this.isLoading = false;
			},
			() => {
				this.isLoading = false;
			});
	}

}
