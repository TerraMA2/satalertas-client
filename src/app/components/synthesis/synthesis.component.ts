import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { Property } from 'src/app/models/property.model';

import { ConfigService } from 'src/app/services/config.service';

import { FilterService } from 'src/app/services/filter.service';

import { SidebarService } from 'src/app/services/sidebar.service';

import { SynthesisService } from '../../services/synthesis.service';

import { Response } from '../../models/response.model';

import { NavigationService } from '../../services/navigation.service';

import { SynthesisCard } from '../../models/synthesis-card.model';

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
	deterHistory: SynthesisCard[] = [];
	prodesHistory: SynthesisCard[] = [];
	fireSpotHistory: SynthesisCard[] = [];
	burnedAreaHistory: SynthesisCard[] = [];
	historyDeterChartData: any;
	historyDeterChartOptions: [];
	historyProdesChartData: any;
	historyProdesChartOptions: [];
	burningFireSpotChartData: any;
	historyFireSpotChartOptions: [];
	burnedAreasChartData: any;
	burnedAreasPerPropertyChartDatas: any[] = [];
	historyBurnedChartOptions: [];

	titleDeter;
	titleProdes;
	titleFireSpot;
	titleBurnedArea;
	titleDetailedVisions;
	titleDeforestation;

	constructor(
		private activatedRoute: ActivatedRoute,
		private configService: ConfigService,
		private synthesisService: SynthesisService,
		private filterService: FilterService,
		private sidebarService: SidebarService,
		private navigationService: NavigationService,
		private router: Router
	) {
	}

	ngOnInit() {
		this.filterService.filterSynthesis.subscribe(() => {
			if (this.router.url.startsWith('/synthesis')) {
				this.getPropertyData();
			}
		});
		this.activatedRoute.params.subscribe(params => this.carRegister = params.carRegister);
		this.sidebarService.sidebarLayerShowHide.next(false);
		this.sidebarService.sidebarReload.next('default');

		this.getPropertyData();
	}

	getPropertyData() {
		this.isLoading = true;
		const date = JSON.parse(localStorage.getItem('dateFilter'));
		const startDate = new Date(date[0]).toLocaleDateString('pt-BR');
		const endDate = new Date(date[1]).toLocaleDateString('pt-BR');

		this.formattedFilterDate = `${ startDate } - ${ endDate }`;
		this.synthesisService.getSynthesis(this.carRegister, date).then((response: Response) => {
			const propertyData: Property = response.data;

			this.titleDeter = propertyData.titleDeter;
			this.titleProdes = propertyData.titleProdes;
			this.titleFireSpot = propertyData.titleFireSpot;
			this.titleBurnedArea = propertyData.titleBurnedArea;
			this.titleDetailedVisions = propertyData.titleDetailedVisions;
			this.titleDeforestation = propertyData.titleDeforestation;
			this.historyDeterChartOptions = propertyData.historyDeterChartOptions;
			this.historyProdesChartOptions = propertyData.historyProdesChartOptions;
			this.historyFireSpotChartOptions = propertyData.historyFireSpotChartOptions;
			this.historyBurnedChartOptions = propertyData.historyBurnedChartOptions;

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
		});

		this.synthesisService.getNDVI(this.carRegister, date).then(data => {
			this.chartImages = data;
			this.isLoading = false;
		}).catch(error => this.isLoading = false);
	}

	onViewReportClicked(reportType) {
		if (reportType === 'synthesis') {
			this.router.navigateByUrl(`/synthesis/${ this.carRegister.replace('/', '\\') }`);
		} else {
			this.router.navigateByUrl(`/reports/${ reportType }/${ this.carRegister.replace('/', '\\') }`);
		}
	}

	trackById(index, item) {
		return item.id;
	}

	back() {
		this.navigationService.back();
	}
}
