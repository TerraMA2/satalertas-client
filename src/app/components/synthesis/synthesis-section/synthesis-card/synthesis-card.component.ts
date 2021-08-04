import { Component, Input, OnInit } from '@angular/core';
import { SynthesisCard } from '../../../../models/synthesis-card.model';

@Component({
	selector: 'app-report-card',
	templateUrl: './synthesis-card.component.html',
	styleUrls: ['./synthesis-card.component.css']
})
export class SynthesisCardComponent implements OnInit {
	@Input() card: SynthesisCard;

	constructor() {
	}

	ngOnInit(): void {
	}

}
