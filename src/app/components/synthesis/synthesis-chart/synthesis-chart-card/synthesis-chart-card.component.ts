import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-report-chart-card',
	templateUrl: './synthesis-chart-card.component.html',
	styleUrls: ['./synthesis-chart-card.component.css']
})
export class SynthesisChartCardComponent implements OnInit {
	@Input() data;
	@Input() options;
	@Input() type;

	constructor() {
	}

	ngOnInit(): void {
	}

}
