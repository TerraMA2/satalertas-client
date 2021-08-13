import { Component, Input } from '@angular/core';

import { AnalysisChart } from '../../../models/analysis-chart.model';

@Component({
	selector: 'app-charts-area',
	templateUrl: './charts-area.component.html',
	styleUrls: ['./charts-area.component.css']
})
export class ChartsAreaComponent {
	@Input() analysisCharts: AnalysisChart[] = [];

	trackById(index, item) {
		return item.id;
	}

}
