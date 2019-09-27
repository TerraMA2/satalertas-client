import { Component, OnInit, Input } from '@angular/core';

import { Property } from 'src/app/models/property.model';

@Component({
  selector: 'app-property-data',
  templateUrl: './property-data.component.html',
  styleUrls: ['./property-data.component.css']
})
export class PropertyDataComponent implements OnInit {

  @Input() property: Property;

  constructor(
  ) { }

  ngOnInit() {

  }

}
