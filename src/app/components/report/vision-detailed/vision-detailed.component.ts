import { Component, Input, OnInit } from '@angular/core';

import { Vision } from 'src/app/models/vision.model';

@Component({
  selector: 'app-vision-detailed',
  templateUrl: './vision-detailed.component.html',
  styleUrls: ['./vision-detailed.component.css']
})
export class VisionDetailedComponent {

  @Input() detailedVisions: Vision[] = [];

  date: string;

  constructor() { }

}
