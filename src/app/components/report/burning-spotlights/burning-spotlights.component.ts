import { Component, OnInit, Input } from '@angular/core';

import { Vision } from 'src/app/models/vision.model';

import { Property } from 'src/app/models/property.model';

import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-burning-spotlights',
  templateUrl: './burning-spotlights.component.html',
  styleUrls: ['./burning-spotlights.component.css']
})
export class BurningSpotlightsComponent implements OnInit {

  @Input() property: Property;

  burningSpotlights: Vision[] = [];

  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit() {
    const burningSpotlightsData = this.configService.getConfig('report').burningSpotlights;

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
  }

}
