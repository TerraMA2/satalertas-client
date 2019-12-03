import { Component, OnInit, Input } from '@angular/core';

import { Vision } from 'src/app/models/vision.model';

@Component({
  selector: 'app-deforestation-deter',
  templateUrl: './deforestation-deter.component.html',
  styleUrls: ['./deforestation-deter.component.css']
})
export class DeforestationDeterComponent implements OnInit {

  @Input() deforestationDeters: Vision[] = [];

  constructor() { }

  ngOnInit() {
  }

}
