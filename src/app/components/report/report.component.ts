import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { HTTPService } from 'src/app/services/http.service';

import { Property } from 'src/app/models/property.model';

import { ConfigService } from 'src/app/services/config.service';

import { Vision } from 'src/app/models/vision.model';

import { Legend } from 'src/app/models/legend.model';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  carRegister: string;

  property: Property;

  bbox: string;

  cityBBox: string;

  private reportConfig;

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
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => this.carRegister = params.carRegister);
    this.reportConfig = this.configService.getConfig('report');
    this.visionLegends = this.reportConfig.visionslegends;
    this.getPropertyData();
  }

  getPropertyData() {
    const propertyConfig = this.reportConfig.propertyData;
    const url = propertyConfig.url;
    const viewId = propertyConfig.viewId;
    const carRegister = this.carRegister;
    this.hTTPService.get(url, {viewId, carRegister}).subscribe((propertyData: Property) => {
      const bboxArray = propertyData.bbox.split(',');
      this.bbox = bboxArray[0].split(' ').join(',') + ',' + bboxArray[1].split(' ').join(',');

      const cityBBoxArray = propertyData.cityBBox.split(',');
      this.cityBBox = cityBBoxArray[0].split(' ').join(',') + ',' + cityBBoxArray[1].split(' ').join(',');

      this.property = propertyData;

      this.getVisions();

      this.getDetailedVisions();

      this.getDeforestations();

      this.getDeforestationHistories();

      this.getBurningSpotlightsChart(propertyData.burningSpotlights);

      this.getBurnedAreas();

      this.getBurnedAreasChart(propertyData.burnedAreas, propertyData.area);

      this.getLandsatHistories();
    });
  }

  getVisions() {
    const visionsData = this.reportConfig.visions;
    visionsData.forEach((visionData: Vision) => {
      let image = visionData.image;
      image = image.replace('{bbox}', this.bbox);
      image = image.replace('{citybbox}', this.cityBBox);
      image = image.replace('{cityCqlFilter}', `municipio='${this.property.city}';numero_do2='${this.property.register}'`);
      image = image.replace('{propertyCqlFilter}', `numero_do2='${this.property.register}'`);
      image = image.replace(/\{carRegister\}/g, `'${this.property.register}'`);
      const currentDateInput = JSON.parse(localStorage.getItem('dateFilter'));
      image = image.replace('{date}', `${currentDateInput[0]}/${currentDateInput[1]}`);

      const vision = new Vision(
        visionData.id,
        visionData.title,
        image,
        visionData.description,
        visionData.layerData
      );
      this.visions.push(vision);
    });
  }

  getDetailedVisions() {
    const detailedVisionsData = this.reportConfig.detailedVisions;
    detailedVisionsData.forEach((detailedVisionData: Vision) => {
      let image = detailedVisionData.image;
      image = image.replace('{bbox}', this.bbox);
      const currentDateInput = JSON.parse(localStorage.getItem('dateFilter'));
      image = image.replace('{date}', `${currentDateInput[0]}/${currentDateInput[1]}`);
      image = image.replace('{propertyCqlFilter}', `numero_do2='${this.property.register}'`);
      image = image.replace(/\{carRegister\}/g, `'${this.property.register}'`);
      const vision = new Vision(
        detailedVisionData.id,
        detailedVisionData.title,
        image,
        detailedVisionData.description,
        detailedVisionData.layerData
      );
      this.detailedVisions.push(vision);
    });
  }

  getDeforestations() {
    const deforestationsData = this.reportConfig.deforestations;
    deforestationsData.forEach((deforestationData: Vision) => {
      let image = deforestationData.image;
      image = image.replace('{bbox}', this.bbox);
      image = image.replace('{propertyCqlFilter}', `numero_do2='${this.property.register}'`);
      const currentDateInput = JSON.parse(localStorage.getItem('dateFilter'));
      image = image.replace('{date}', `${currentDateInput[0]}/${currentDateInput[1]}`);
      const vision = new Vision(
        deforestationData.id,
        deforestationData.title,
        image,
        deforestationData.description,
        deforestationData.layerData
      );
      this.deforestations.push(vision);
    });
  }

  getDeforestationHistories() {
    const deforestationHistoriesData = this.reportConfig.deforestationHistories;
    deforestationHistoriesData.forEach((deforestationHistoryData: Vision) => {
      let image = deforestationHistoryData.image;
      image = image.replace('{bbox}', this.bbox);
      image = image.replace('{propertyCqlFilter}', `numero_do2='${this.property.register}'`);
      const currentDateInput = JSON.parse(localStorage.getItem('dateFilter'));
      image = image.replace('{date}', `${currentDateInput[0]}/${currentDateInput[1]}`);
      const vision = new Vision(
        deforestationHistoryData.id,
        deforestationHistoryData.title,
        image,
        deforestationHistoryData.description,
        deforestationHistoryData.layerData
      );
      this.deforestationHistories.push(vision);
    });
  }

  getBurningSpotlights() {
    const burningSpotlightsData = this.reportConfig.burningSpotlights;
    burningSpotlightsData.forEach((burningSpotlightData: Vision) => {
      let image = burningSpotlightData.image;
      image = image.replace('{bbox}', this.bbox);
      image = image.replace('{propertyCqlFilter}', `numero_do2='${this.property.register}'`);
      const currentDateInput = JSON.parse(localStorage.getItem('dateFilter'));
      image = image.replace('{date}', `${currentDateInput[0]}/${currentDateInput[1]}`);
      const vision = new Vision(
        burningSpotlightData.id,
        burningSpotlightData.title,
        image,
        burningSpotlightData.description,
        burningSpotlightData.layerData
      );
      this.burningSpotlights.push(vision);
    });
  }

  getBurningSpotlightsChart(burningSpotlightsData) {
    const burningSpotlightsYears = [];
    const burningSpotlights = [];
    burningSpotlightsData.forEach(burningSpotlightData => {
      const focusCount = burningSpotlightData['focuscount'];
      const year = burningSpotlightData['year'];
      burningSpotlightsYears.push(year);
      burningSpotlights.push(focusCount);
    });

    this.burningSpotlightsChartData = {
      labels: burningSpotlightsYears,
      datasets: [
          {
              label: 'Focos',
              backgroundColor: [
                '#4BC0C0',
                '#FFCE56',
                '#aa7900',
                '#36A2EB',
                '#FF6384'
              ],
              data: burningSpotlights
          }
      ]
    };
  }

  getBurnedAreas() {
    const burnedAreasData = this.reportConfig.burnedAreas;
    burnedAreasData.forEach((burnedAreaData: Vision) => {
      let image = burnedAreaData.image;
      image = image.replace('{bbox}', this.bbox);
      image = image.replace('{propertyCqlFilter}', `numero_do2='${this.property.register}'`);
      const currentDateInput = JSON.parse(localStorage.getItem('dateFilter'));
      image = image.replace('{date}', `${currentDateInput[0]}/${currentDateInput[1]}`);
      const vision = new Vision(
        burnedAreaData.id,
        burnedAreaData.title,
        image,
        burnedAreaData.description,
        burnedAreaData.layerData
      );
      this.burnedAreas.push(vision);
    });
  }

  getBurnedAreasChart(burnedAreasData, propertyArea) {
    const burnedAreasYears = [];
    const burnedAreas = [];
    const burnedAreasPerProperty = [];
    burnedAreasData.forEach(burnedAreaData => {
      const focusCount = burnedAreaData['focuscount'];
      const year = burnedAreaData['year'];
      burnedAreasYears.push(year);
      burnedAreas.push(focusCount);
      burnedAreasPerProperty.push([propertyArea, focusCount]);
    });

    this.burnedAreasChartData = {
      labels: burnedAreasYears,
      datasets: [
          {
              label: 'Focos',
              backgroundColor: [
                '#FF6384',
                '#4BC0C0',
                '#FFCE56',
                '#aa7900',
                '#36A2EB'
              ],
              data: burnedAreas
          }
      ]
    };

    burnedAreasPerProperty.forEach(burnedArea => {
      const chartData = {
        labels: ['Área imóvel', 'Área queimada'],
        datasets: [
            {
                backgroundColor: [
                  '#FF6384',
                  '#4BC0C0',
                  '#FFCE56',
                  '#aa7900',
                  '#36A2EB'
                ],
                data: burnedArea
            }
        ]
      };
      this.burnedAreasPerPropertyChartDatas.push(chartData);
    });
  }

  getLandsatHistories() {
    const landsatHistoriesData = this.reportConfig.landsatHistories;
    landsatHistoriesData.forEach((landsatHistoryData: Vision) => {
      let image = landsatHistoryData.image;
      image = image.replace('{bbox}', this.bbox);
      image = image.replace('{propertyCqlFilter}', `numero_do2='${this.property.register}'`);
      const currentDateInput = JSON.parse(localStorage.getItem('dateFilter'));
      image = image.replace('{date}', `${currentDateInput[0]}/${currentDateInput[1]}`);
      const vision = new Vision(
        landsatHistoryData.id,
        landsatHistoryData.title,
        image,
        landsatHistoryData.description,
        landsatHistoryData.layerData
      );
      this.landsatHistories.push(vision);
    });
  }
}
