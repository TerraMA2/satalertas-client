import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-burning-focus-chart',
  templateUrl: './burning-focus-chart.component.html',
  styleUrls: ['./burning-focus-chart.component.css']
})
export class BurningFocusChartComponent implements OnInit {

  @Input() data;

  constructor() { }

  ngOnInit() {
  }

}
