import { Component, OnInit, Input } from '@angular/core';

import { Vision } from 'src/app/models/vision.model';

import { Property } from 'src/app/models/property.model';

import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-deforestation',
  templateUrl: './deforestation.component.html',
  styleUrls: ['./deforestation.component.css']
})
export class DeforestationComponent implements OnInit {

  @Input() property: Property;

  deforestations: Vision[] = [];

  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit() {
    const deforestationsData = this.configService.getConfig('report').deforestations;

    deforestationsData.forEach((deforestationData: Vision) => {
      const vision = new Vision(
        deforestationData.id,
        deforestationData.title,
        deforestationData.image,
        deforestationData.description,
        deforestationData.layerData
      );
      this.deforestations.push(vision);
    });
  }

}
