import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-footer-filter-area',
    templateUrl: './footer-filter-area.component.html',
    styleUrls: ['./footer-filter-area.component.css']
})
export class FooterFilterAreaComponent implements OnInit {

    @Output() onClearFilterClicked: EventEmitter<Event> = new EventEmitter<Event>();
    @Output() onFilterClicked: EventEmitter<Event> = new EventEmitter<Event>();
    @Output() onCloseClicked: EventEmitter<Event> = new EventEmitter<Event>();

    constructor() {
    }

    ngOnInit() {
    }

}
