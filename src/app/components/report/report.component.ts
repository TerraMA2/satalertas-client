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

  legends: Legend[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private hTTPService: HTTPService,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => this.carRegister = params.carRegister);
    this.reportConfig = this.configService.getConfig('report');
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
    });
  }

}
