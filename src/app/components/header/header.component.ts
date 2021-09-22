import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { ConfigService } from '../../services/config.service';

import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';

import { MessageService, PrimeNGConfig } from 'primeng/api';

import { FilterService } from '../../services/filter.service';

import { SidebarService } from 'src/app/services/sidebar.service';

import { MapService } from 'src/app/services/map.service';

import { environment } from 'src/environments/environment';

import { FilterDate } from '../../models/filter-date.model';

import { DropdownElement } from '../../models/dropdown-element.model';

import { TranslateService } from '@ngx-translate/core';

import { Router } from '@angular/router';

import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

	@Output() showHideSidebarClicked = new EventEmitter<boolean>();

	@ViewChild('dateFilter', { static: true }) datePicker;
	isAdministrator: boolean;
	loggedUserName: string;
	isAuthenticated = false;
	dateInput;
	maxDate = new Date();
	dateField: FilterDate;
	optionField;
	displaySidebar = true;
	displayLogin = false;
	hasLogin = false;
	headerTitle: string;
	appConfig;
	selectedLanguage: DropdownElement;
	languages: DropdownElement[];
	private userSub: Subscription;
	private filterConfig;
	settings = false;
	showIcon = 'pi pi-cog';

	expanded = false;

	isMobile = false;

	constructor(
		private configService: ConfigService,
		private authService: AuthService,
		private messageService: MessageService,
		private filterService: FilterService,
		private sidebarService: SidebarService,
		private mapService: MapService,
		private translateService: TranslateService,
		private config: PrimeNGConfig,
		private router: Router,
		private deviceDetectorService: DeviceDetectorService
	) {
	}

	ngOnInit() {
		this.isMobile = this.deviceDetectorService.isMobile();
		this.appConfig = this.configService.getAppConfig();
		const locale = this.appConfig.locale;
		this.languages = locale.languages;
		const defaultLanguage = locale.defaultLanguage;
		this.selectedLanguage = this.languages.find(language => language.value === defaultLanguage);
		this.setFilterSettings();
		this.headerTitle = this.appConfig.headerTitle;
		this.hasLogin = this.appConfig.hasLogin;

		this.userSub = this.authService.user.subscribe(user => {
			if (user) {
				this.isAdministrator = user.administrator;
				this.isAuthenticated = true;
				this.loggedUserName = user.username;
			}
		});
	}

	setFilterSettings() {
		this.filterConfig = this.configService.getFilterConfig();
		this.dateField = this.filterConfig.date;
		this.optionField = this.filterConfig.optionField;
		this.setDefaultDate();
	}

	setDefaultDate() {
		const currentDate = new Date();
		let firstDate;
		if (!environment.production) {
			firstDate = new Date('01/01/2001');
		} else {
			firstDate = new Date('01/01/' + currentDate.getFullYear());
		}
		const currentDateInput = JSON.parse(localStorage.getItem('dateFilter'));

		if (JSON.parse(localStorage.getItem('dataFilter')) !== null) {
			localStorage.removeItem('dataFilter');
		}

		if (currentDateInput !== null) {
			this.dateInput = [new Date(currentDateInput[0]), new Date(currentDateInput[1])];
		} else {
			this.dateInput = [firstDate, currentDate];
			localStorage.setItem('dateFilter', JSON.stringify(this.dateInput));
		}
	}

	showHideSidebar() {
		this.displaySidebar = !this.displaySidebar;
		this.showHideSidebarClicked.emit(this.displaySidebar);
		window.dispatchEvent(new Event('resize'));
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
		this.messageService.add(
			{
				severity: 'success',
				summary: '',
				detail: 'Logout realizado com successo!'
			}
		);
		this.sidebarService.sidebarReload.next('default');
		this.mapService.clearMap.next();
		this.router.navigateByUrl('/');
	}

	ngOnDestroy() {
		this.userSub.unsubscribe();
	}

	onFilterClose() {
		this.setDefaultDate();
	}

	onFilterFocus(event: KeyboardEvent) {
		if (document.querySelector('.p-datepicker') && (event.code === 'Enter')) {
			this.onFilterClick();
		}
	}

	onTodayClick() {
		const rangeCurrent = this.getCurrentFilterValues();

		this.updateCurrentDateRange(rangeCurrent);
	}

	getCurrentFilterValues() {
		const date: Date = new Date();

		return {
			firstDate: {
				day: 1,
				month: 0,
				year: date.getFullYear(),
				today: false,
				selectable: false
			},
			currentDate: {
				day: date.getDay(),
				month: date.getMonth(),
				year: date.getFullYear(),
				today: true,
				selectable: true
			}
		};
	}

	updateCurrentDateRange(dateRange) {
		this.updateCurrentDate(dateRange.currentDate);

		this.datePicker.selectDate(dateRange.firstDate);
		this.datePicker.selectDate(dateRange.currentDate);

		this.datePicker.updateInputfield();
	}

	updateCurrentDate(currentDate) {
		this.datePicker.currentMonth = currentDate.month;
		this.datePicker.currentYear = currentDate.year;

		this.datePicker.createMonth(this.datePicker.currentMonth, this.datePicker.currentYear);
	}

	onFilterClick() {
		localStorage.setItem('dateFilter', JSON.stringify(this.dateInput));

		this.filterService.filterMap.next(false);
		this.filterService.filterTable.next();
		this.filterService.filterSynthesis.next();
		this.filterService.filterDashboard.next();

		this.datePicker.toggle();
	}

	showFilter() {
		this.filterService.displayFilter.next();
	}

	languageChanged(event) {
		const language = event.value;
		this.translateService.use(language.value);
		this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
	}

	settingsInOut() {
		if (this.settings) {
			this.router.navigateByUrl('/map')
			this.settings = false;
			this.showIcon = 'pi pi-cog'
		} else {
			this.router.navigateByUrl('/settings/groups')
			this.settings = true;
			this.showIcon = 'fas fa-door-open'
		}
	}
}
