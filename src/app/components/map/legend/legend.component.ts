import { Component, OnInit, Input } from '@angular/core';

import { Layer } from 'src/app/models/layer.model';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit {

  @Input() selectedLayers: Layer[] = [];

  @Input() displayLegend = false;

  constructor() { }

  ngOnInit() {
  }

  trackById(index, item) {
    return item.id;
  }
}
