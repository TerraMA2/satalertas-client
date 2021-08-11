import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FilterSpecificSearch } from '../../../models/filter-specific-search.model';

import { Util } from '../../../utils/util';

import { FilterService } from '../../../services/filter.service';

@Component({
	selector: 'app-specific-search',
	templateUrl: './specific-search.component.html',
	styleUrls: ['./specific-search.component.css']
})
export class SpecificSearchComponent implements OnInit {
	@Input() disable;
	@Output() onChangeSpecificSearch: EventEmitter<FilterSpecificSearch> = new EventEmitter<FilterSpecificSearch>();
	maxlength = '18';
	specificSearchFilter: FilterSpecificSearch;

	constructor(
		private filterService: FilterService
	) {
	}

	ngOnInit() {
		this.filterService.changeSpecificSearch.subscribe(value => this.specificSearchFilter = value);
		this.specificSearchFilter = new FilterSpecificSearch(false, 'CAR', undefined);
	}

	onChange(event) {
		this.maxlength = this.specificSearchFilter.carCPF === 'CPF' ? '18' : '100';

		this.specificSearchFilter.inputValue = null;
		this.onChangeSpecificSearch.emit(this.specificSearchFilter);
	}

	onChangeInput(event) {
		if (this.specificSearchFilter.carCPF === 'CPF') {
			const eCpfCnpj = document.getElementById('inputValue');
			eCpfCnpj['value'] = Util.cpfCnpjMask(event);
			this.specificSearchFilter.inputValue = Util.cpfCnpjMask(event);
		}

		this.onChangeSpecificSearch.emit(this.specificSearchFilter);
	}

	public clearAll() {
		this.specificSearchFilter = new FilterSpecificSearch(false, 'CAR', undefined);
		this.onChange(this.specificSearchFilter);
	}
}
