import { Component, OnInit, Input } from '@angular/core';

import { Vision } from 'src/app/models/vision.model';

import { Property } from 'src/app/models/property.model';

import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-burned-areas',
  templateUrl: './burned-areas.component.html',
  styleUrls: ['./burned-areas.component.css']
})
export class BurnedAreasComponent implements OnInit {

  @Input() property: Property;

  burnedAreas: Vision[] = [];

  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit() {
    const burnedAreasData = this.configService.getConfig('report').burnedAreas;

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
  }

}
