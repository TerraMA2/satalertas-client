import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { HTTPService } from 'src/app/services/http.service';

import { Property } from 'src/app/models/property.model';

import { ConfigService } from 'src/app/services/config.service';

import { Vision } from 'src/app/models/vision.model';

import { Legend } from 'src/app/models/legend.model';

import { ReportService } from 'src/app/services/report.service';

import { FilterService } from 'src/app/services/filter.service';

import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  private reportConfig;

  carRegister: string;

  property: Property;

  bbox: string;

  cityBBox: string;

  visions: Vision[] = [];

  detailedVisions: Vision[] = [];

  deforestations: Vision[] = [];

  deforestationHistoryDeters: Vision[] = [];

  deforestationHistoryProdes: Vision[] = [];

  deforestationHistories: Vision[] = [];

  burningSpotlights: Vision[] = [];

  burningSpotlightsChartData: any;

  burnedAreas: Vision[] = [];

  burnedAreasChartData: any;

  burnedAreasPerPropertyChartDatas: any[] = [];

  landsatHistories: Vision[] = [];

  visionLegends: Legend[] = [];

  formattedFilterDate: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private hTTPService: HTTPService,
    private configService: ConfigService,
    private reportService: ReportService,
    private filterService: FilterService,
    private sidebarService: SidebarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.filterService.filterReport.subscribe(() => {
      if (this.router.url.startsWith('/report')) {
        this.getPropertyData();
      }
    });
    this.activatedRoute.params.subscribe(params => this.carRegister = params.carRegister);
    this.reportConfig = this.configService.getReportConfig();
    this.visionLegends = this.reportConfig.visionslegends;

    this.sidebarService.sidebarLayerShowHide.next(false);

    this.getPropertyData();
  }

  getPropertyData() {
    const date = JSON.parse(localStorage.getItem('dateFilter'));
    const startDate = new Date(date[0]).toLocaleDateString('pt-BR');
    const endDate = new Date(date[1]).toLocaleDateString('pt-BR');

    const filter = JSON.parse(localStorage.getItem('filterList'));

    this.formattedFilterDate = `${startDate} - ${endDate}`;

    const propertyConfig = this.reportConfig.propertyData;
    const url = propertyConfig.url;
    const viewId = propertyConfig.viewId;
    this.carRegister = this.carRegister.replace('\\', '/');
    const carRegister = this.carRegister;
    this.hTTPService.get(url, {viewId, carRegister, date, filter})
                    .subscribe((propertyData: Property) => {
      const burnedAreas = propertyData.burnedAreas;

      const area = propertyData.area;

      this.property = propertyData;

      this.visions = this.reportService.getVisions(propertyData, this.reportConfig.visions);

      this.detailedVisions = this.reportService.getVisions(propertyData, this.reportConfig.detailedVisions);

      this.deforestations = this.reportService.getVisions(propertyData, this.reportConfig.deforestations);

      this.deforestationHistoryDeters = this.reportService.getVisions(propertyData, this.reportConfig.deforestationHistoryDeters, 'deterYear');

      this.deforestationHistoryProdes = this.reportService.getVisions(propertyData, this.reportConfig.deforestationHistoryProdes, 'prodesYear');

      this.burnedAreas = this.reportService.getVisions(propertyData, this.reportConfig.burnedAreas, 'burnedAreasYear');

      this.burnedAreasChartData = this.reportService.getVisions(propertyData, this.reportConfig.burnedAreas);

      this.landsatHistories = this.reportService.getVisions(propertyData, this.reportConfig.landsatHistories);

      this.burningSpotlights = this.reportService.getVisions(propertyData, this.reportConfig.burningSpotlights, 'spotlightsYear');

      this.burningSpotlightsChartData = this.reportService.getBurningSpotlightsChart(propertyData.burningSpotlights);

      this.burnedAreasChartData = this.reportService.getBurnedAreasChart(burnedAreas);

      this.burnedAreasPerPropertyChartDatas = this.reportService.getBurnedAreasPerPropertyChart(burnedAreas, area);
    });
  }

  onViewReportClicked() {
    this.router.navigateByUrl(`/finalReport/${this.carRegister.replace('/', '\\')}`);
  }
}
