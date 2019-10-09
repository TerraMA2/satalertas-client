import { Component, Input } from '@angular/core';

import { Vision } from 'src/app/models/vision.model';

@Component({
  selector: 'app-deforestation-history',
  templateUrl: './deforestation-history.component.html',
  styleUrls: ['./deforestation-history.component.css']
})
export class DeforestationHistoryComponent {

  @Input() deforestationHistories: Vision[] = [];

  constructor() { }

}
