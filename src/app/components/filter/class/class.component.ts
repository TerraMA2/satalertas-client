import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FilterClass } from '../../../models/filter-class.model';

import { ConfigService } from '../../../services/config.service';

import { FilterAlertAnalyses } from '../../../models/filter-alert-type-analyzes.model';

import { FilterService } from '../../../services/filter.service';

@Component({
	selector: 'app-class',
	templateUrl: './class.component.html',
	styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit, AfterViewInit {

	@Input() disable;
	@Output() onChangeClassFilter: EventEmitter<FilterClass> = new EventEmitter<FilterClass>();

	filter;
	filterClass: FilterClass;

	constructor(
		private configService: ConfigService,
		private filterService: FilterService
	) {
	}

	ngOnInit() {
		this.filterService.changeClass.subscribe(value => this.filterClass = value);
		this.filterClass = new FilterClass('ALL', []);
		this.filter = this.configService.getFilterConfig('classSearch');
	}

	async ngAfterViewInit() {
		for (const analyze of this.filter.analyzes) {
			const options = await this.filterService.getAllClassByType(analyze.value);

			this.filterClass.analyzes.push(new FilterAlertAnalyses(analyze.label, analyze.value, undefined, options));
		}
	}

	onChange(event) {
		const result = this.filterClass.radioValue !== 'ALL' ? this.filterClass : undefined;

		this.onChangeClassFilter.emit(result);
	}

	public clearAll() {
		if (this.filterClass) {
			this.filterClass = new FilterClass('ALL', this.filterClass.analyzes);
			this.onChangeClassFilter.emit(this.filterClass);
		}
	}

	onAllClicked() {
		this.filterClass.analyzes.forEach(analysis => analysis.valueOption = undefined);
	}

	checkValid() {
		return this.filterClass && this.filterClass.radioValue;
	}

	checkAnalyzesValid() {
		return this.filterClass &&
			this.filterClass.radioValue &&
			(this.filterClass.radioValue !== 'ALL') &&
			this.filterClass.analyzes &&
			(this.filterClass.analyzes.length > 0);
	}

	trackById(index, item) {
		return item.id;
	}
}
