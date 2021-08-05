import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterAuthorization } from '../../../models/filter-authorization.model';
import { FilterService } from '../../../services/filter.service';

@Component({
	selector: 'app-authorization-area',
	templateUrl: './authorization-area.component.html',
	styleUrls: ['./authorization-area.component.css']
})
export class AuthorizationAreaComponent implements OnInit {

	@Input() disable;
	@Output() onChangeAuthorization: EventEmitter<FilterAuthorization> = new EventEmitter<FilterAuthorization>();
	authorizations: FilterAuthorization[] = [];
	authorization = 'ALL';

	constructor(
		private filterService: FilterService
	) {
	}

	ngOnInit() {
		this.filterService.changeAuthorization.subscribe(value => {
			this.authorizations = [];
			this.authorizations.push(value)
		})
		this.authorizations.push(new FilterAuthorization('Todos', 'ALL'));
		this.authorization = 'ALL';
	}

	onChange(event) {
		this.onChangeAuthorization.emit(event);
	}

	public clearAll() {
		this.authorization = 'ALL';
		this.onChangeAuthorization.emit(new FilterAuthorization('Todos', 'ALL'));
	}
}
