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
    authorizations: FilterAuthorization[] = [];
    authorization = 'ALL';

    constructor() {
    }

    ngOnInit() {
        this.authorizations.push(new FilterAuthorization('Todos', 'ALL'));
        this.authorization = 'ALL';
    }

    onChange(event) {
        this.onchangeAuthorization.emit(event);
    }

    public clearAll() {
        this.authorization = 'ALL';
        this.onchangeAuthorization.emit(new FilterAuthorization('Todos', 'ALL'));
    }
}
