import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-footer-filter',
	templateUrl: './footer-filter.component.html',
	styleUrls: ['./footer-filter.component.css']
})
export class FooterFilterComponent {
	@Output() onClearFilterClicked: EventEmitter<Event> = new EventEmitter<Event>();
	@Output() onFilterClicked: EventEmitter<Event> = new EventEmitter<Event>();
	@Output() onCloseClicked: EventEmitter<Event> = new EventEmitter<Event>();
}
