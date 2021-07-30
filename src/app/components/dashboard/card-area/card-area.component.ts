import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Alert} from '../../../models/alert.model';

@Component({
	selector: 'app-card-area',
	templateUrl: './card-area.component.html',
	styleUrls: ['./card-area.component.css']
})
export class CardAreaComponent implements OnInit {

	@Input() alertsDisplayed: Alert [] = [];

	@Output() alertClick: EventEmitter<Alert> = new EventEmitter<Alert>();

	@Output() areaClick: EventEmitter<Alert> = new EventEmitter<Alert>();

	constructor() {
	}

	ngOnInit() {
	}

	getLabelArea(alert: Alert) {
		let label: string;

		if (this.isBurnedArea(alert.codgroup)) {
			label = 'scar';
		} else if (this.isFocus(alert.codgroup)) {
			label = 'fireSpots';
		} else {
			label = 'area';
		}

		return label;
	}

	getUnitOfMeasurement(alert: Alert) {
		return (this.isFocus(alert.codgroup) ? '' : 'ha');
	}

	getLabelNumCars() {
		return 'alerts';
	}

	getValueArea(alert: Alert) {
		return alert.value2;
	}

	getValueNumCars(alert: Alert) {
		return alert.value1;
	}

	isFocus(codgroup) {
		return codgroup === 'BURNED';
	}

	isBurnedArea(codgroup) {
		return codgroup === 'BURNED_AREA';
	}

	trackById(index, item) {
		return item.id;
	}
}
