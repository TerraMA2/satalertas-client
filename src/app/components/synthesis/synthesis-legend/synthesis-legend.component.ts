import {Component, Input, OnInit} from '@angular/core';

import {Legend} from 'src/app/models/legend.model';

@Component({
	selector: 'app-report-legend',
	templateUrl: './synthesis-legend.component.html',
	styleUrls: ['./synthesis-legend.component.css']
})
export class SynthesisLegendComponent implements OnInit {

	@Input() legends: Legend[] = [];

	constructor(
	) {
	}

	ngOnInit() {
	}

	trackById(index, item) {
		return item.id;
	}

}
