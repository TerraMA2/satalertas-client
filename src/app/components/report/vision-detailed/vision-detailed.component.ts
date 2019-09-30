import { Component, OnInit, Input } from '@angular/core';

import { Vision } from 'src/app/models/vision.model';

import { ConfigService } from 'src/app/services/config.service';

import { Property } from 'src/app/models/property.model';

@Component({
  selector: 'app-vision-detailed',
  templateUrl: './vision-detailed.component.html',
  styleUrls: ['./vision-detailed.component.css']
})
export class VisionDetailedComponent implements OnInit {

  @Input() property: Property;

  detailedVisions: Vision[] = [];

  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit() {
    const detailedVisionsData = this.configService.getConfig('report').detailedVisions;

    detailedVisionsData.forEach((visionData: Vision) => {
      const vision = new Vision(
        visionData.id,
        visionData.title,
        visionData.image,
        visionData.description,
        visionData.layerData
      );
      this.detailedVisions.push(vision);
    });
  }

}
