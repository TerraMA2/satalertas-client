import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-report-chart',
	templateUrl: './synthesis-chart.component.html',
	styleUrls: ['./synthesis-chart.component.css']
})
export class SynthesisChartComponent implements OnInit {
	@Input() data;
	@Input() options;
	@Input() type;
	@Input() chartDatas;

	constructor() {
	}

	ngOnInit(): void {
	}

	trackById(index, item) {
		return item.id;
	}

}
