import { Component, OnInit, AfterViewInit, Input } from '@angular/core';

import { ConfigService } from 'src/app/services/config.service';

import { Vision } from 'src/app/models/vision.model';

import * as L from 'leaflet';

import { Property } from 'src/app/models/property.model';

@Component({
  selector: 'app-vision',
  templateUrl: './vision.component.html',
  styleUrls: ['./vision.component.css']
})
export class VisionComponent implements OnInit, AfterViewInit {

  private visionConfig;

  @Input() property: Property;

  visions: Vision[] = [];

  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.visionConfig = this.configService.getConfig('report');
  }

  ngAfterViewInit() {
    const visionsData = this.visionConfig.visions;

    visionsData.forEach((visionData: Vision) => {
      const cqlFilter = visionData.layerData.cqlFilter;
      if (cqlFilter) {
        visionData.layerData.cqlFilter = cqlFilter.replace('{carRegister}', this.property.register);
      }
      const vision = new Vision(
        visionData.id,
        visionData.title,
        visionData.image,
        visionData.description,
        visionData.layerData
      );
      this.visions.push(vision);
    });
  }
}
