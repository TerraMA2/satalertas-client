import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfButtonModel} from '../../models/conf-button.model';

@Component({
  selector: 'app-button-action',
  templateUrl: './button-action.component.html',
  styleUrls: ['./button-action.component.css']
})
export class ButtonActionComponent implements OnInit {
  @Input() confButtons: ConfButtonModel[];
  @Input() action: string;
  @Input() rowData: any;

  @Output() onClickReset: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onClickUpdate: EventEmitter<Event> = new EventEmitter<Event>();

  constructor() { }

  ngOnInit() {
  }

  trackById(index, item) {
    return item.id;
  }
}
