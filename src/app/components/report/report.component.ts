import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { HTTPService } from 'src/app/services/http.service';

import { Property } from 'src/app/models/property.model';

import { ConfigService } from 'src/app/services/config.service';

import { Vision } from 'src/app/models/vision.model';

import { Legend } from 'src/app/models/legend.model';

import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  private reportConfig;

  carRegister: string;

  property: Property;

  intersectId: string;

  bbox: string;

  cityBBox: string;

  visions: Vision[] = [];

  detailedVisions: Vision[] = [];

  deforestations: Vision[] = [];

  deforestationHistories: Vision[] = [];

  burningSpotlights: Vision[] = [];

  burningSpotlightsChartData: any;

  burnedAreas: Vision[] = [];

  burnedAreasChartData: any;

  burnedAreasPerPropertyChartDatas: any[] = [];

  landsatHistories: Vision[] = [];

  visionLegends: Legend[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private hTTPService: HTTPService,
    private configService: ConfigService,
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.carRegister = params.carRegister;
      this.intersectId = params.intersectId;
    });
    this.reportConfig = this.configService.getConfig('report');
    this.visionLegends = this.reportConfig.visionslegends;
    this.getPropertyData();
  }

  getPropertyData() {
    const propertyConfig = this.reportConfig.propertyData;
    const url = propertyConfig.url;
    const viewId = propertyConfig.viewId;
    const carRegister = this.carRegister;
    const intersectId = this.intersectId;
    this.hTTPService.get(url, {viewId, carRegister, intersectId}).subscribe((propertyData: Property) => {
      const burnedAreas = propertyData.burnedAreas;

      const area = propertyData.area;

      const bboxArray = propertyData.bbox.split(',');
      this.bbox = bboxArray[0].split(' ').join(',') + ',' + bboxArray[1].split(' ').join(',');

      const cityBBoxArray = propertyData.citybbox.split(',');
      this.cityBBox = cityBBoxArray[0].split(' ').join(',') + ',' + cityBBoxArray[1].split(' ').join(',');

      this.property = propertyData;

      this.visions = this.reportService.getVisions(propertyData, this.reportConfig, this.bbox, this.cityBBox);

      this.detailedVisions = this.reportService.getDetailedVisions(propertyData, this.reportConfig, this.bbox, this.cityBBox);

      this.deforestations = this.reportService.getDeforestations(propertyData, this.reportConfig, this.bbox);

      this.deforestationHistories = this.reportService.getDeforestationHistories(propertyData, this.reportConfig, this.bbox);

      this.burningSpotlightsChartData = this.reportService.getBurningSpotlightsChart(propertyData.burningSpotlights);

      this.burnedAreas = this.reportService.getBurnedAreas(propertyData, this.reportConfig, this.bbox);

      this.burnedAreasChartData = this.reportService.getBurnedAreasChart(burnedAreas);

      this.burnedAreasPerPropertyChartDatas = this.reportService.getBurnedAreasPerPropertyChart(burnedAreas, area);

      this.landsatHistories = this.reportService.getLandsatHistories(propertyData, this.reportConfig, this.bbox);
    });
  }
}
