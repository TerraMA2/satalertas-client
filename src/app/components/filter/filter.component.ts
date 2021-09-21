import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { NgForm } from '@angular/forms';

import { FilterService } from '../../services/filter.service';

import { FilterTheme } from '../../models/filter-theme.model';

import { ThemeComponent } from './theme/theme.component';

import { FilterParam } from '../../models/filter-param.model';

import { FilterAuthorization } from '../../models/filter-authorization.model';

import { AuthorizationComponent } from './authorization/authorization.component';

import { AlertTypeComponent } from './alert-type/alert-type.component';

import { SpecificSearchComponent } from './specific-search/specific-search.component';

import { FilterSpecificSearch } from '../../models/filter-specific-search.model';

import { FilterAlertType } from '../../models/filter-alert-type.model';

import { FilterClass } from '../../models/filter-class.model';

import { ClassComponent } from './class/class.component';

import { DeviceDetectorService } from 'ngx-device-detector';

import { SidebarService } from '../../services/sidebar.service';

@Component({
	selector: 'app-filter',
	templateUrl: './filter.component.html',
	styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, AfterViewInit {
	@ViewChild('filterForm') filterForm: NgForm;
	@ViewChild('themeAreaComponent') themeAreaComponent: ThemeComponent;
	@ViewChild('alertTypeAreaComponent') alertTypeAreaComponent: AlertTypeComponent;
	@ViewChild('authorizationAreaComponent') authorizationAreaComponent: AuthorizationComponent;
	@ViewChild('specificSearchAreaComponent') specificSearchAreaComponent: SpecificSearchComponent;
	@ViewChild('classAreaComponent') classAreaComponent: ClassComponent;

	authorizationDisable: boolean;

	filterParam: FilterParam;
	displayFilter = false;
	isMobile = false;

	constructor(
		private filterService: FilterService,
		private deviceDetectorService: DeviceDetectorService,
		private sidebarService: SidebarService
	) {
	}

	ngOnInit() {
		this.isMobile = this.deviceDetectorService.isMobile();
		this.authorizationDisable = true;
		this.filterParam = new FilterParam(
			new FilterTheme(),
			new FilterAlertType('ALL'),
			new FilterAuthorization('Todos', 'ALL'),
			new FilterSpecificSearch(false));
	}

	ngAfterViewInit() {
		this.setFilterEvents();
	}

	setFilterEvents() {
		this.filterService.displayFilter.subscribe(() => this.onDisplayFilter());
	}

	saveFilterState() {
		localStorage.removeItem('filterState');
		localStorage.setItem('filterState', JSON.stringify(this.filterParam));
	}

	restoreFilterState() {
		const filterState: FilterParam = JSON.parse(localStorage.getItem('filterState'));
		if(filterState) {
			this.filterParam = filterState;
			this.filterService.changeAlertType.next(filterState.alertType);
			this.filterService.changeTheme.next(filterState.themeSelected);
			this.filterService.changeAuthorization.next(filterState.authorization);
			this.filterService.changeSpecificSearch.next(filterState.specificSearch);
			this.filterService.changeClass.next(filterState.classSearch);
		}
	}

	onDialogHide() {
		this.onCloseClicked();
	}

	onDisplayFilter() {
		if (this.isMobile) {
			this.sidebarService.sidebarShowHide.next(false);
		}
		this.restoreFilterState();
		this.displayFilter = !this.displayFilter;
	}

	onCloseClicked() {
		this.displayFilter = false;
	}

	onFilterClicked(zoomIn: boolean) {
		this.saveFilterState();
		this.filterService.filterMap.next(zoomIn);
		this.filterService.filterDashboard.next();
		this.filterService.filterTable.next();
		this.filterService.filterSynthesis.next();
	}

	onClearFilterClicked() {
		this.authorizationDisable = true;

		this.clearOthers();
		this.specificSearchAreaComponent.clearAll();

		this.onFilterClicked(false);
	}

	onUpdateFilterTheme(theme: FilterTheme) {
		this.filterParam.themeSelected = theme;
	}

	onUpdateAlertType(alertType: FilterAlertType) {
		this.filterParam.alertType = alertType;
	}

	onUpdateClassFilter(classSearch: FilterClass) {
		this.filterParam.classSearch = classSearch;
	}

	onUpdateAuthorization(authorization: FilterAuthorization) {
		this.filterParam.authorization = authorization;
	}

	onUpdateSpecificSearch(specificSearch: FilterSpecificSearch) {
		if (specificSearch) {
			this.clearOthers();
		}

		this.filterParam.specificSearch = specificSearch;
	}

	clearOthers() {
		this.themeAreaComponent.clearAll();
		this.alertTypeAreaComponent.clearAll();
		this.classAreaComponent.clearAll();
	}
}
