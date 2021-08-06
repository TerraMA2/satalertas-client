import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { NgForm } from '@angular/forms';

import { FilterService } from '../../services/filter.service';

import { FilterTheme } from '../../models/filter-theme.model';

import { ThemeAreaComponent } from './theme-area/theme-area.component';

import { FilterParam } from '../../models/filter-param.model';

import { FilterAuthorization } from '../../models/filter-authorization.model';

import { AuthorizationAreaComponent } from './authorization-area/authorization-area.component';

import { AlertTypeAreaComponent } from './alert-type-area/alert-type-area.component';

import { SpecificSearchAreaComponent } from './specific-search-area/specific-search-area.component';

import { FilterSpecificSearch } from '../../models/filter-specific-search.model';

import { FilterAlertType } from '../../models/filter-alert-type.model';

import { FilterClass } from '../../models/filter-class.model';

import { ClassAreaComponent } from './class-area/class-area.component';

@Component({
	selector: 'app-filter',
	templateUrl: './filter.component.html',
	styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, AfterViewInit {
	@ViewChild('filterForm') filterForm: NgForm;
	@ViewChild('themeAreaComponent') themeAreaComponent: ThemeAreaComponent;
	@ViewChild('alertTypeAreaComponent') alertTypeAreaComponent: AlertTypeAreaComponent;
	@ViewChild('authorizationAreaComponent') authorizationAreaComponent: AuthorizationAreaComponent;
	@ViewChild('specificSearchAreaComponent') specificSearchAreaComponent: SpecificSearchAreaComponent;
	@ViewChild('classAreaComponent') classAreaComponent: ClassAreaComponent;

	authorizationDisable: boolean;

	filterParam: FilterParam;
	displayFilter = false;

	constructor(
		private filterService: FilterService
	) {
	}

	ngOnInit() {
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

	updateFilter() {
		localStorage.removeItem('filterState');
		localStorage.setItem('filterState', JSON.stringify(this.filterParam));
	}

	getFilter() {
		const filterState: FilterParam = JSON.parse(localStorage.getItem('filterState'));
		if(filterState) {
			this.filterParam = filterState;
			this.filterService.changeAlertType.next(filterState.alertType);
			this.filterService.changeTheme.next(filterState.themeSelected);
			this.filterService.changeAuthorization.next(filterState.autorization);
			this.filterService.changeSpecificSearch.next(filterState.specificSearch);
			this.filterService.changeClass.next(filterState.classSearch);
		}
	}

	onDialogHide() {
		this.onCloseClicked();
	}

	onDisplayFilter() {
		this.getFilter();
		this.displayFilter = !this.displayFilter;
	}

	onCloseClicked() {
		this.displayFilter = false;
	}

	onFilterClicked(zoomIn: boolean) {
		this.updateFilter();
		this.filterService.filterMap.next(zoomIn);
		this.filterService.filterDashboard.next();
		this.filterService.filterTable.next();
		this.filterService.filterSynthesis.next();
	}

	onClearFilterClicked() {
		this.authorizationDisable = true;

		this.cleanOthers();
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
		this.filterParam.autorization = authorization;
	}

	onUpdateSpacificSearch(spacificSearch: FilterSpecificSearch) {
		if (spacificSearch) {
			this.cleanOthers();
		}

		this.filterParam.specificSearch = spacificSearch;
	}

	cleanOthers() {
		this.themeAreaComponent.clearAll();
		this.alertTypeAreaComponent.clearAll();
		this.classAreaComponent.clearAll();
	}
}
