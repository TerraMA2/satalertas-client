import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../../services/config.service';

import { AnalysisChart } from '../../models/analysis-chart.model';

import { FilterService } from '../../services/filter.service';

import { SidebarService } from 'src/app/services/sidebar.service';

import { DashboardService } from '../../services/dashboard.service';

import { Analysis } from '../../models/analysis.model';

import { Response } from '../../models/response.model';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
	analysisList: Analysis[]
	analysisCharts: AnalysisChart[] = [];
	isLoading = false;

	isMobile = false;

	constructor(
		private configService: ConfigService,
		private filterService: FilterService,
		private sidebarService: SidebarService,
		private dashboardService: DashboardService,
		private deviceDetectorService: DeviceDetectorService
	) {
	}

	ngOnInit() {
		this.isLoading = true;
		this.getAnalysis();
		this.setEvents();
		this.sidebarService.sidebarReload.next('default');
		this.sidebarService.sidebarLayerShowHide.next(false);
		this.isMobile = this.deviceDetectorService.isMobile();
		if (this.isMobile) {
			this.sidebarService.sidebarShowHide.next(false);
		}
	}

	getAnalysis() {
		this.dashboardService.getAnalysis().then((response: Response) => {
			this.analysisList = response.data;
			this.setActiveArea();
			this.isLoading = false;
		}).catch((error: Response) => this.isLoading = false);
	}

	setEvents() {
		this.filterService.filterDashboard.subscribe(() => this.getAnalysis());
	}

	setActiveArea() {
		const analysis = this.analysisList.find((a: Analysis) => a.activeArea)
		this.areaClick(analysis);
	}

	areaClick(analysisSelected) {
		this.activeArea(analysisSelected.analysisCharts);
		this.analysisClick(analysisSelected, false);
	}

	alertClick(analysisSelected) {
		this.activeAlert(analysisSelected.analysisCharts);
		this.analysisClick(analysisSelected, true);
	}

	analysisClick(analysisSelected, isAlert = false) {
		this.clearActive();

		this.dashboardService.getAnalysisCharts(analysisSelected.analysisCharts)
			.then((response: Response) => {
				this.analysisCharts = response.data;

				analysisSelected.activeAlert = isAlert;
				analysisSelected.activeArea = !isAlert;

				if (this.analysisCharts && this.analysisCharts.length > 0) {
					this.analysisCharts[0].active = true;
				}
			});
	}

	private clearActive() {
		if (this.analysisList) {
			this.analysisList.forEach((analysis: Analysis) => {
				analysis.activeAlert = false;
				analysis.activeArea = false;
			});
		}

		this.analysisCharts = [];
	}

	private activeArea(analysisCharts) {
		if (analysisCharts) {
			analysisCharts.forEach(analysisChart => analysisChart.activeArea = true);
		}
	}

	private activeAlert(analysisCharts) {
		if (analysisCharts) {
			analysisCharts.forEach(analysisChart => analysisChart.activeArea = false);
		}
	}
}
