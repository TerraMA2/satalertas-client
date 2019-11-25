import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FilterSpecificSearch} from '../../../models/filter-specific-search.model';

@Component({
  selector: 'app-specific-search-area',
  templateUrl: './specific-search-area.component.html',
  styleUrls: ['./specific-search-area.component.css']
})
export class SpecificSearchAreaComponent implements OnInit {
  @Input() disable;
  @Output() onchangeAuthorization: EventEmitter<FilterSpecificSearch> = new EventEmitter<FilterSpecificSearch>();

  constructor() { }

  specificSearchFilter: FilterSpecificSearch;

  ngOnInit() {
    this.specificSearchFilter = new FilterSpecificSearch(false, 'CAR', undefined);
  }

  onChange(event) {
    this.onchangeAuthorization.emit(this.specificSearchFilter);
  }

  public clearAll() {
    this.specificSearchFilter = new FilterSpecificSearch(false, 'CAR', undefined);
    this.onChange(this.specificSearchFilter);
  }
}
