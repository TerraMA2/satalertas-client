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

  private reportConfig;

  visions: Vision[] = [];

  detailedVisions: Vision[] = [];

  deforestations: Vision[] = [];

  deforestationHistories: Vision[] = [];

  burningSpotlights: Vision[] = [];

  burnedAreas: Vision[] = [];

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
    this.hTTPService.get(url, {viewId, carRegister}).subscribe(propertyData => {
      const bboxArray = propertyData['bbox'].split(',');
      const bbox = bboxArray[0].split(' ').join(',') + ',' + bboxArray[1].split(' ').join(',');

      const latLong = [propertyData['lat'], propertyData['long']];

      this.property = new Property(propertyData['register'],
                                  propertyData['area'],
                                  propertyData['name'],
                                  propertyData['city'],
                                  bbox,
                                  latLong,
      );
      const visionsData = this.reportConfig.visions;
      visionsData.forEach((visionData: Vision) => {
        const image = visionData.image.replace('{bbox}', this.property.bbox);
        const vision = new Vision(
          visionData.id,
          visionData.title,
          image,
          visionData.description,
          visionData.layerData
        );
        this.visions.push(vision);
      });

      const detailedVisionsData = this.reportConfig.detailedVisions;
      detailedVisionsData.forEach((detailedVisionData: Vision) => {
        const image = detailedVisionData.image.replace('{bbox}', this.property.bbox);
        const vision = new Vision(
          detailedVisionData.id,
          detailedVisionData.title,
          image,
          detailedVisionData.description,
          detailedVisionData.layerData
        );
        this.detailedVisions.push(vision);
      });

      const deforestationsData = this.reportConfig.deforestations;
      deforestationsData.forEach((deforestationData: Vision) => {
        const image = deforestationData.image.replace('{bbox}', this.property.bbox);
        const vision = new Vision(
          deforestationData.id,
          deforestationData.title,
          image,
          deforestationData.description,
          deforestationData.layerData
        );
        this.deforestations.push(vision);
      });

      const deforestationHistoriesData = this.reportConfig.deforestationHistories;
      deforestationHistoriesData.forEach((deforestationHistoryData: Vision) => {
        const image = deforestationHistoryData.image.replace('{bbox}', this.property.bbox);
        const vision = new Vision(
          deforestationHistoryData.id,
          deforestationHistoryData.title,
          image,
          deforestationHistoryData.description,
          deforestationHistoryData.layerData
        );
        this.deforestationHistories.push(vision);
      });

      const burningSpotlightsData = this.reportConfig.burningSpotlights;
      burningSpotlightsData.forEach((burningSpotlightData: Vision) => {
        const image = burningSpotlightData.image.replace('{bbox}', this.property.bbox);
        const vision = new Vision(
          burningSpotlightData.id,
          burningSpotlightData.title,
          image,
          burningSpotlightData.description,
          burningSpotlightData.layerData
        );
        this.burningSpotlights.push(vision);
      });

      const burnedAreasData = this.reportConfig.burnedAreas;
      burnedAreasData.forEach((burnedAreaData: Vision) => {
        const image = burnedAreaData.image.replace('{bbox}', this.property.bbox);
        const vision = new Vision(
          burnedAreaData.id,
          burnedAreaData.title,
          image,
          burnedAreaData.description,
          burnedAreaData.layerData
        );
        this.burnedAreas.push(vision);
      });

      const landsatHistoriesData = this.reportConfig.landsatHistories;
      landsatHistoriesData.forEach((landsatHistoryData: Vision) => {
        const image = landsatHistoryData.image.replace('{bbox}', this.property.bbox);
        const vision = new Vision(
          landsatHistoryData.id,
          landsatHistoryData.title,
          image,
          landsatHistoryData.description,
          landsatHistoryData.layerData
        );
        this.landsatHistories.push(vision);
      });
    });
  }
}
