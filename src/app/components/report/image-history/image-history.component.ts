import { Component, OnInit, Input } from '@angular/core';

import { Vision } from 'src/app/models/vision.model';

import { Property } from 'src/app/models/property.model';

import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-image-history',
  templateUrl: './image-history.component.html',
  styleUrls: ['./image-history.component.css']
})
export class ImageHistoryComponent implements OnInit {

  @Input() property: Property;

  landsatHistories: Vision[] = [];

  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit() {
    const landsatHistoriesData = this.configService.getConfig('report').landsatHistories;

    landsatHistoriesData.forEach((landsatHistoryData: Vision) => {
      const vision = new Vision(
        landsatHistoryData.id,
        landsatHistoryData.title,
        landsatHistoryData.image,
        landsatHistoryData.description,
        landsatHistoryData.layerData
      );
      this.landsatHistories.push(vision);
    });
  }

}
