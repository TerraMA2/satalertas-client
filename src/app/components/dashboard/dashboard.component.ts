import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../../services/config.service';

import { AnalysisChart } from '../../models/analysis-chart.model';

import { FilterService } from '../../services/filter.service';

import { SidebarService } from 'src/app/services/sidebar.service';

import { DashboardService } from '../../services/dashboard.service';

import { Analysis } from '../../models/analysis.model';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
	analysisList: Analysis[]
	analysisCharts: AnalysisChart[] = [];
	isLoading = false;

	constructor(
		private configService: ConfigService,
		private filterService: FilterService,
		private sidebarService: SidebarService,
		private dashboardService: DashboardService
	) {
	}

	ngOnInit() {
		this.isLoading = true;
		this.getAnalysis();
		this.setEvents();
		this.sidebarService.sidebarReload.next();
		this.sidebarService.sidebarLayerShowHide.next(false);
	}

	getAnalysis() {
		this.dashboardService.getAnalysis().then((analysis: Analysis[]) => {
			if (!analysis) {
				this.isLoading = false;
				return;
			}
			this.analysisList = analysis;
			this.setActiveArea();
			this.isLoading = false;
		});
	}

	setEvents() {
		this.filterService.filterDashboard.subscribe(() => this.getAnalysis());
	}

	setActiveArea() {
		const analysis = this.analysisList.find((a: Analysis) => a.activearea)
		this.areaClick(analysis);
	}

	areaClick(analysisSelected) {
		this.activeArea(analysisSelected.analysischarts);
		this.analysisClick(analysisSelected, false);
	}

	alertClick(analysisSelected) {
		this.activeAlert(analysisSelected.analysischarts);
		this.analysisClick(analysisSelected, true);
	}

	analysisClick(analysisSelected, isAlert = false) {
		this.clearActive();

		this.dashboardService.getAnalysisCharts(analysisSelected.analysischarts)
			.then((analysisChart: AnalysisChart[]) => {
				this.analysisCharts = analysisChart;

				analysisSelected.activealert = isAlert;
				analysisSelected.activearea = !isAlert;

				if (this.analysisCharts && this.analysisCharts.length > 0) {
					this.analysisCharts[0].active = true;
				}
			});
	}

	private clearActive() {
		if (this.analysisList && this.analysisList.length > 0) {
			this.analysisList.forEach((analysis: Analysis) => {
				analysis.activealert = false;
				analysis.activearea = false;
			});
		}

		this.analysisCharts = [];
	}

	private activeArea(analysisCharts) {
		if (analysisCharts && analysisCharts.length > 0) {
			analysisCharts.forEach(analysisChart => analysisChart.activearea = true);
		}
	}

	private activeAlert(analysisCharts) {
		if (analysisCharts && analysisCharts.length > 0) {
			analysisCharts.forEach(analysisChart => analysisChart.activearea = false);
		}
	}
}
