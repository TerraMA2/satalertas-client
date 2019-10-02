import { Component, OnInit, Input } from '@angular/core';

import { ConfigService } from 'src/app/services/config.service';

import { Vision } from 'src/app/models/vision.model';

import { Legend } from 'src/app/models/legend.model';

@Component({
  selector: 'app-vision',
  templateUrl: './vision.component.html',
  styleUrls: ['./vision.component.css']
})
export class VisionComponent implements OnInit {

  private reportConfig;

  @Input() visions: Vision[] = [];

  @Input() legends: Legend[] = [];

  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.reportConfig = this.configService.getConfig('report');
    this.legends = this.reportConfig.visionslegends;
  }
}
