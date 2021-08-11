import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Analysis } from '../../../../models/analysis.model';

@Component({
	selector: 'app-card-button',
	templateUrl: './card-button.component.html',
	styleUrls: ['./card-button.component.css']
})
export class CardButtonComponent {

	@Input() analysis: Analysis;

	@Input() labelArea: string;

	@Input() valueArea: number;

	@Input() labelNumCars: string;

	@Input() valueNumCars: number;

	@Input() unitOfMeasurement: string;

	@Output() alertClick: EventEmitter<Analysis> = new EventEmitter<Analysis>();

	@Output() areaClick: EventEmitter<Analysis> = new EventEmitter<Analysis>();

}
