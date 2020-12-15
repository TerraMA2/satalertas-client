import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Alert} from '../../../models/alert.model';

@Component({
    selector: 'app-card-area',
    templateUrl: './card-area.component.html',
    styleUrls: ['./card-area.component.css']
})
export class CardAreaComponent implements OnInit {

    @Input() alertsDisplayed: Alert [] = [];

    @Output() onNubermImmobileClick: EventEmitter<Alert> = new EventEmitter<Alert>();

    @Output() onAreaClick: EventEmitter<Alert> = new EventEmitter<Alert>();

    constructor() {
    }

    ngOnInit() {
    }

    getLabelArea(alert: Alert) {
        let label: string;

        if (this.isBurnedArea(alert.codgroup)) {
            label = 'Cicatriz:';
        } else if (this.isFocus(alert.codgroup)) {
            label = 'Nº Focos:';
        } else {
            label = 'Área:';
        }

        return label;
    }

    getUnitOfMeasurement(alert: Alert) {
        return (this.isFocus(alert.codgroup) ? '' : 'ha');
    }

    getLabelNumCars(alert: Alert) {
        return 'Alertas:';
    }

    getValueArea(alert: Alert) {
        return alert.value2;
    }

    getValueNumCars(alert: Alert) {
        return alert.value1;
    }

    isFocus(codgroup) {
        return codgroup === 'BURNED';
    }

    isBurnedArea(codgroup) {
        return codgroup === 'BURNED_AREA';
    }

    trackById(index, item) {
        return item.id;
    }
}
