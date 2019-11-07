import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FilterAuthorization} from '../../../models/filter-authorization.model';

@Component({
  selector: 'app-authorization-area',
  templateUrl: './authorization-area.component.html',
  styleUrls: ['./authorization-area.component.css']
})
export class AuthorizationAreaComponent implements OnInit {

  @Input() disable;
  @Output() onchangeAuthorization: EventEmitter<FilterAuthorization> = new EventEmitter<FilterAuthorization>();

  constructor() { }

  authorizations: FilterAuthorization[];

  authorization: FilterAuthorization = 'TODOS';

  ngOnInit() {
    this.authorizations = [
      {label: 'TODOS', value: 'TODOS'}
    ];
  }

  onChange(event) {
    this.onchangeAuthorization.emit(this.authorization);
  }

  public clearAll() {
    this.authorization = 'TODOS';
    this.onchangeAuthorization.emit(this.authorization);
  }
}
