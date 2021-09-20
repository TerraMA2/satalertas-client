import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Analysis } from '../../../models/analysis.model';

@Component({
	selector: 'app-card-area',
	templateUrl: './card-area.component.html',
	styleUrls: ['./card-area.component.css']
})
export class CardAreaComponent {

	@Input() analysisList: Analysis[] = [];

	@Output() alertClick: EventEmitter<Analysis> = new EventEmitter<Analysis>();

	@Output() areaClick: EventEmitter<Analysis> = new EventEmitter<Analysis>();

	getLabelArea(analysis: Analysis) {
		let label = 'Area';
		if (this.isBurnedArea(analysis.groupCode)) {
			label = 'Scar';
		} else if (this.isFireSpot(analysis.groupCode)) {
			label = 'Fire Spots';
		}
		return label;
	}

	getUnitOfMeasurement(analysis: Analysis) {
		return (this.isFireSpot(analysis.groupCode) ? '' : 'ha');
	}

	getLabelNumCars() {
		return 'Alerts';
	}

	getValueArea(analysis: Analysis) {
		return analysis.area;
	}

	getValueNumCars(analysis: Analysis) {
		return analysis.alert;
	}

	isFireSpot(groupCode) {
		return groupCode === 'BURNED';
	}

	isBurnedArea(groupCode) {
		return groupCode === 'BURNED_AREA';
	}

	trackById(index, item) {
		return item.id;
	}
}
