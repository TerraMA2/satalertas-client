import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sub-layer-table',
  templateUrl: './sub-layer-table.component.html',
})
export class SubLayerTableComponent implements OnInit {
  @Input() subLayers
  constructor() { }

  ngOnInit(): void {
  }

}
