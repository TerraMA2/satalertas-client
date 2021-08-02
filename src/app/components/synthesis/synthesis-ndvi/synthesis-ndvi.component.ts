import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-report-ndvi',
  templateUrl: './synthesis-ndvi.component.html',
  styleUrls: ['./synthesis-ndvi.component.css']
})
export class SynthesisNdviComponent implements OnInit {
  @Input() chartImages;
  @Input() formattedFilterDate;
  constructor() { }

  ngOnInit(): void {
  }
  trackById(index, item) {
    return item.id;
  }
}
