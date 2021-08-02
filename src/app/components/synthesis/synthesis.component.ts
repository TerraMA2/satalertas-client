import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';

import {Property} from 'src/app/models/property.model';

import {ConfigService} from 'src/app/services/config.service';

import {FilterService} from 'src/app/services/filter.service';

import {SidebarService} from 'src/app/services/sidebar.service';

import {SynthesisService} from '../../services/synthesis.service';

import {Response} from '../../models/response.model';

@Component({
	selector: 'app-report',
	templateUrl: './synthesis.component.html',
	styleUrls: ['./synthesis.component.css']
})
export class SynthesisComponent implements OnInit {
	carRegister: string;
	property: Property;

	formattedFilterDate: string;
	chartImages = [];
	isLoading = false;

	visions;
	detailedVisions;
	legends;
	deforestations;
	deterHistory: [];
	prodesHistory: [];
	fireSpotHistory: [];
	burnedAreaHistory: [];
	historyDeterChartData: any;
	historyDeterChartOptions: [];
	historyProdesChartData: any;
	historyProdesChartOptions: [];
	burningFireSpotChartData: any;
	historyFireSpotChartOptions: [];
	burnedAreasChartData: any;
	burnedAreasPerPropertyChartDatas: any[] = [];
	historyBurnedChartOptions: [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private configService: ConfigService,
		private synthesisService: SynthesisService,
		private filterService: FilterService,
		private sidebarService: SidebarService,
		private router: Router,
	) {
	}

	async ngOnInit() {
		this.filterService.filterReport.subscribe(() => {
			if (this.router.url.startsWith('/synthesis')) {
				this.getPropertyData();
			}
		});
		this.activatedRoute.params.subscribe(params => this.carRegister = params.carRegister);
		this.sidebarService.sidebarLayerShowHide.next(false);

		await this.getPropertyData();
	}

	async getPropertyData() {
		const synthesisConfig = this.configService.getSynthesisConfig();
		const cardsConfig = synthesisConfig.cards;
		const chartsConfig = synthesisConfig.charts;
		this.historyDeterChartOptions = chartsConfig.deter;
		this.historyProdesChartOptions = chartsConfig.prodes;
		this.historyFireSpotChartOptions = chartsConfig.fireSpot;
		this.historyBurnedChartOptions = chartsConfig.burnedArea;
		this.isLoading = true;
		const date = JSON.parse(localStorage.getItem('dateFilter'));
		const startDate = new Date(date[0]).toLocaleDateString('pt-BR');
		const endDate = new Date(date[1]).toLocaleDateString('pt-BR');

		this.formattedFilterDate = `${startDate} - ${endDate}`;

		await this.synthesisService.getSynthesis(this.carRegister, date, this.formattedFilterDate, JSON.stringify(cardsConfig)).then(async (response: Response) => {
			const propertyData = response.data;

			this.property = propertyData;
			this.visions = propertyData.visions;
			this.legends = propertyData.legends;
			this.detailedVisions = propertyData.detailedVisions;
			this.deforestations = propertyData.deforestations;
			this.deterHistory = propertyData.deterHistory;
			this.prodesHistory = propertyData.prodesHistory;
			this.fireSpotHistory = propertyData.fireSpotHistory;
			this.burnedAreaHistory = propertyData.burnedAreaHistory;
			this.historyDeterChartData = this.synthesisService.getChart(this.deterHistory, 'DETER');
			this.historyProdesChartData = this.synthesisService.getChart(this.prodesHistory, 'PRODES');
			this.burningFireSpotChartData = this.synthesisService.getChart(this.fireSpotHistory, 'Focos');
			this.burnedAreasChartData = this.synthesisService.getChart(this.burnedAreaHistory, 'Áreas Queimadas');
			this.burnedAreasPerPropertyChartDatas = this.synthesisService.getPerPropertyChart(this.burnedAreaHistory, propertyData.area, 'Áreas Queimadas');
			const prodesAlerts = propertyData.prodesAlerts.data;
			this.chartImages = this.synthesisService.getNDVI(prodesAlerts);
			this.isLoading = false;
		});
	}

	onViewReportClicked(reportType) {
		if (reportType === 'synthesis') {
			this.router.navigateByUrl(`/synthesis/${this.carRegister.replace('/', '\\')}`);
		} else {
			this.router.navigateByUrl(`/report/${reportType}/${this.carRegister.replace('/', '\\')}`);
		}
	}

	trackById(index, item) {
		return item.id;
	}
}
