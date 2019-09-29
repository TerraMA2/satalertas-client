import { Component, OnInit, Input } from '@angular/core';

import { Vision } from 'src/app/models/vision.model';

import { Property } from 'src/app/models/property.model';

import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-deforestation-history',
  templateUrl: './deforestation-history.component.html',
  styleUrls: ['./deforestation-history.component.css']
})
export class DeforestationHistoryComponent implements OnInit {

  @Input() property: Property;

  deforestationHistories: Vision[] = [];

  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit() {
    const deforestationHistoriesData = this.configService.getConfig('report').deforestationHistories;

    deforestationHistoriesData.forEach((deforestationHistoryData: Vision) => {
      const vision = new Vision(
        deforestationHistoryData.id,
        deforestationHistoryData.title,
        deforestationHistoryData.image,
        deforestationHistoryData.description,
        deforestationHistoryData.layerData
      );
      this.deforestationHistories.push(vision);
    });
  }

}
