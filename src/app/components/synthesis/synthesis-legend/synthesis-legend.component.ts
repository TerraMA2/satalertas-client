import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-report-legend',
	templateUrl: './synthesis-legend.component.html',
	styleUrls: ['./synthesis-legend.component.css']
})
export class SynthesisLegendComponent implements OnInit {

	@Input() legends = [];

	constructor() {
	}

	ngOnInit() {
	}

	trackById(index, item) {
		return item.id;
	}

}
