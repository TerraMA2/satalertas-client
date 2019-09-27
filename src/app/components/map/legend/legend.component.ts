import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit {

  @Input() selectedLayers = [];

  @Input() displayLegend = false;

  constructor() { }

  ngOnInit() {
  }

  trackByFunction(index, item) {
    return index;
  }
}
