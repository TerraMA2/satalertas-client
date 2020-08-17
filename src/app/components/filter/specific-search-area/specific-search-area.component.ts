import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {FilterSpecificSearch} from '../../../models/filter-specific-search.model';

import {Util} from '../../../utils/util';

@Component({
    selector: 'app-specific-search-area',
    templateUrl: './specific-search-area.component.html',
    styleUrls: ['./specific-search-area.component.css']
})
export class SpecificSearchAreaComponent implements OnInit {
    @Input() disable;
    @Output() onchangeAuthorization: EventEmitter<FilterSpecificSearch> = new EventEmitter<FilterSpecificSearch>();
    maxlength = '18';
    specificSearchFilter: FilterSpecificSearch;

    constructor() {
    }

    ngOnInit() {
        this.specificSearchFilter = new FilterSpecificSearch(false, 'CAR', undefined);
    }

    onChange(event) {
        this.maxlength = this.specificSearchFilter.CarCPF === 'CPF' ? '18' : '100';

        this.specificSearchFilter.inputValue = null;
        this.onchangeAuthorization.emit(this.specificSearchFilter);
    }

    onChangeInput(event) {
        if (this.specificSearchFilter.CarCPF === 'CPF') {
            const eCpfCnpj = document.getElementById('inputValue');
            eCpfCnpj['value'] = Util.cpfCnpjMask(event);
            this.specificSearchFilter.inputValue = Util.cpfCnpjMask(event);
        }

        this.onchangeAuthorization.emit(this.specificSearchFilter);
    }

    public clearAll() {
        this.specificSearchFilter = new FilterSpecificSearch(false, 'CAR', undefined);
        this.onChange(this.specificSearchFilter);
    }
}
