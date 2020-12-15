import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Alert} from '../../../../models/alert.model';

@Component({
    selector: 'app-card-button',
    templateUrl: './card-button.component.html',
    styleUrls: ['./card-button.component.css']
})
export class CardButtonComponent implements OnInit {

    @Input() alert: Alert;

    @Input() labelArea: string;

    @Input() valueArea: number;

    @Input() labelNumCars: string;

    @Input() valueNumCars: number;

    @Input() unitOfMeasurement: string;

    @Output() onNubermImmobileClick: EventEmitter<Alert> = new EventEmitter<Alert>();

    @Output() onAreaClick: EventEmitter<Alert> = new EventEmitter<Alert>();

    constructor() {
    }

    ngOnInit() {
    }
}
