import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-footer-filter-area',
  templateUrl: './footer-filter-area.component.html',
  styleUrls: ['./footer-filter-area.component.css']
})
export class FooterFilterAreaComponent implements OnInit {

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onClearFilterClicked: EventEmitter<Event> = new EventEmitter<Event>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onFilterClicked: EventEmitter<Event> = new EventEmitter<Event>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onCloseClicked: EventEmitter<Event> = new EventEmitter<Event>();

  constructor() { }

  ngOnInit() {
  }

}
