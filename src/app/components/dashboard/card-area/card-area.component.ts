
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Alert} from '../../../models/alert.model';
import {ControlValueAccessor} from '@angular/forms';

@Component({
  selector: 'app-card-area',
  templateUrl: './card-area.component.html',
  styleUrls: ['./card-area.component.css']
})
export class CardAreaComponent implements OnInit {

  @Input() alertsDisplayed: Alert [] = [];

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onNubermImmobileClick: EventEmitter<Alert> = new EventEmitter<Alert>();

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onAreaClick: EventEmitter<Alert> = new EventEmitter<Alert>();

  constructor(
  ) { }

  ngOnInit() {
  }

  getLabelArea(alert: Alert) {
    let label: string;

    if (this.isBurnedArea(alert.cod)) {
      label = 'Cicatriz:';
    } else if (this.isFocus(alert.cod)) {
      label = 'Nº Focos:';
    } else {
      label = 'Área:';
    }

    return label;
  }
  getUnitOfMeasurement(alert: Alert) {
    return (this.isFocus(alert.cod) ? '' : 'ha');
  }

  getLabelNumCars(alert: Alert) {
    return 'Nº de Cars:';
  }

  getValeuArea(alert: Alert) {
    return alert.value2;
  }

  getValueNumCars(alert: Alert) {
    return alert.value1;
  }

  isFocus(cod) {
    return cod === 'FOCOS';
  }

  isBurnedArea(cod) {
    return cod === 'AREA_QUEIMADA';
  }
}
