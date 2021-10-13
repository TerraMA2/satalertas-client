import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Filter } from '../../models/new-filter.model';
import { FilterService } from '../../services/filter.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SidebarService } from '../../services/sidebar.service';

@Component({
	selector: 'app-new-filter',
	templateUrl: './new-filter.component.html',
	styleUrls: ['./new-filter.component.css']
})
export class NewFilterComponent implements OnInit {
	displayFilter = false;
	isMobile = false;
	formGroup: FormGroup;
	filter: Filter;

	constructor(
		private filterService: FilterService,
		private deviceDetectorService: DeviceDetectorService,
		private sidebarService: SidebarService
	) {
	}

	ngOnInit(): void {
		this.filterService.displayFilter.subscribe(() => this.onDisplayFilter());
		this.formGroup = this.filterService.getFormGroup();
		this.restoreFilterState();
	}

	onDisplayFilter() {
		if (this.isMobile) {
			this.sidebarService.sidebarShowHide.next(false);
		}
		this.restoreFilterState();
		this.displayFilter = !this.displayFilter;
	}

	onDialogHide() {
		this.onCloseClicked();
	}

	onSubmit() {
		this.filter = this.formGroup.value;
		console.dir(this.formGroup);
		this.saveFilterState();
	}

	onRemoveFiltersClicked() {
		localStorage.removeItem('newFilterState');
		this.formGroup.reset({
			theme: {
				description: 'all',
				value: 'none'
			},
			class: {
				deterValue: 'all',
				prodesValue: 'all',
				fireSpotValue: 'all',
				burnedAreaValue: 'all'
			},
			search: {
				isSearch: false,
				description: 'stateCAR',
				value: null
			}
		});
	}

	onCloseClicked() {
		this.displayFilter = false;
	}

	saveFilterState() {
		localStorage.removeItem('newFilterState');
		localStorage.setItem('newFilterState', JSON.stringify(this.filter));
	}

	restoreFilterState() {
		const filter: Filter = JSON.parse(localStorage.getItem('newFilterState'));
		if (filter) {
			this.filter = filter;
			this.formGroup.setValue(filter);
		}
	}
}
