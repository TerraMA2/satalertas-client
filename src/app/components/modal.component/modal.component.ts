import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LineInputModel} from '../../models/line-input.model';
import {Message, MessageService} from 'primeng-lts/api';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  providers: [MessageService]
})
export class ModalComponent implements OnInit {
  @Input() displayModal: boolean;
  @Input() header: string;
  @Input() lines: LineInputModel[];
  @Input() data = {};
  @Input() modalStyle: any;
  @Output() onHideModal: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onClickCancel: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onClickSave: EventEmitter<Event> = new EventEmitter<Event>();
  @Input() actionType = {};

  ccRegex: RegExp = /[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;

  msgs: Message[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    // this.confButtons = [
    //   {show: true, disable: false, label: 'Cancel', buttonClass: 'btn btn-secondary',
    //     action: () => {
    //       this.onClickCancel.emit();
    //       this.onClose();
    //     }
    //   },
    //   {show: true, disable: false, label: 'Save', buttonClass: 'btn btn-primary btn-group-margin-right-1',
    //     action: () => {
    //       this.onSave(this.validateFields());
    //     }
    //   }
    // ];
  }

  trackById(index, item) {
    return index;
  }

  onSave(validationMessage) {
    if (validationMessage) {
      this.showError(validationMessage);
    } else {
      this.onClickSave.emit();
      this.cleanInputs();
    }
  }

  onClose() {
    this.cleanInputs();
    this.msgs = [];
    this.onClickCancel.emit();
  }

  cleanInputs() {
    for (const line of this.lines) {
      for (const input of line.inputs) {
        input.model = '';
        const inputDoc = document.getElementById(input.name);
        if (inputDoc && inputDoc['value']) {
          inputDoc['value'] = '';
        }
      }
    }
  }

  onChange(inputName, indexInput, numberLine) {
    const input = document.getElementById(inputName);
    this.lines[numberLine].inputs[indexInput].model = input['value'];
    this.lines[numberLine].inputs[indexInput].name = inputName;
  }

  validateFields() {
    let numberFields = 0;
    let emptyFields = '';
    for (const line of this.lines) {
      for (const input of line.inputs) {
        if (input.required && (this.data[input.field] === '')) {
          numberFields++;
          emptyFields =
            !emptyFields ? `'${input.label}'` :
              `${emptyFields} e '${input.label}'`;
        }
      }
    }
    if (emptyFields) {
      emptyFields = (numberFields > 1) ?
        `Os campos ${emptyFields} são obrigatórios!` :
        `O campo ${emptyFields} é obrigatório!`;
    }
    return emptyFields;
  }

  showError(message: string) {
    this.clearMsgs()
    this.msgs.push({severity: 'error', summary: 'Error Message', detail: message});
  }

  clearMsgs() {
    this.msgs = [];
  }
}
