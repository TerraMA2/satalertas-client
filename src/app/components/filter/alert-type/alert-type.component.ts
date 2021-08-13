import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FilterAlertType } from '../../../models/filter-alert-type.model';

import { ConfigService } from '../../../services/config.service';

import { FilterAlertAnalyses } from '../../../models/filter-alert-type-analyzes.model';

import { FilterService } from '../../../services/filter.service';

@Component({
	selector: 'app-alert-type',
	templateUrl: './alert-type.component.html',
	styleUrls: ['./alert-type.component.css']
})
export class AlertTypeComponent implements OnInit, AfterViewInit {
	@Input() disable;
	@Output() onChangeAlertType: EventEmitter<FilterAlertType> = new EventEmitter<FilterAlertType>();
	alertType: FilterAlertType;
	filter;

	constructor(
		private configService: ConfigService,
		private filterService: FilterService
	) {
	}

	ngOnInit() {
		this.filterService.changeAlertType.subscribe(value => this.alertType = value);
		this.alertType = new FilterAlertType('ALL', []);
		this.filter = this.configService.getFilterConfig('alertType');
	}

	ngAfterViewInit() {
		this.filter.analyzes.forEach(analyze => {
			const options = (analyze.value === 'burned') ? this.filter.fireSpotOptions : this.filter.options;

			this.alertType.analyzes.push(new FilterAlertAnalyses(analyze.label, analyze.value, undefined, options));
		});
	}

	onChange() {
		const result = this.alertType.radioValue !== 'ALL' ? this.alertType : undefined;

		this.onChangeAlertType.emit(result);
	}

	onChangeAnalyzeOption() {
		this.alertType.analyzes.forEach(analyze => {
			if (analyze.valueOption && analyze.valueOption['value'] && (analyze.valueOption['value'] !== 6)) {
				analyze.valueOptionBiggerThen = undefined;
			}
		});
		this.onChange();
	}

	public clearAll() {
		this.alertType = new FilterAlertType('ALL', this.alertType.analyzes);
		this.onChangeAlertType.emit(this.alertType);
	}

	checkAlertTypeValid() {
		return this.alertType && this.alertType.radioValue;
	}

	checkAnalyzesValid() {
		return this.alertType &&
			this.alertType.radioValue &&
			(this.alertType.radioValue !== 'ALL') &&
			this.alertType.analyzes &&
			(this.alertType.analyzes.length > 0);
	}

	isCustomSelected(analysis) {
		return analysis.valueOption && analysis.valueOption.value && analysis.valueOption.value === 6;
	}

	onAllClicked() {
		this.alertType.analyzes.forEach(analysis => analysis.valueOption = undefined);
	}

	trackById(index, item) {
		return item.id;
	}

}
