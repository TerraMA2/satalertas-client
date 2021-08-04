import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message, MessageService } from 'primeng/api';

@Component({
	selector: 'app-layers-advanced-edition',
	templateUrl: './layers-advanced-edition.component.html',
	styleUrls: ['./layers-advanced-edition.component.css'],
	providers: [MessageService]
})
export class LayersAdvancedEditionComponent implements OnInit {
	@Input() header: string;
	@Input() data = {};
	@Input() displayModal: boolean;
	@Output() onHideModal: EventEmitter<Event> = new EventEmitter<Event>();
	@Output() onClickCancel: EventEmitter<Event> = new EventEmitter<Event>();
	@Output() onClickSave: EventEmitter<Event> = new EventEmitter<Event>();
	@Input() layers;
	@Input() newData = {};
	subLayers;
	msgs: Message[] = [];
	submit = false;

	constructor(private messageService: MessageService) {
	}

	ngOnInit(): void {
	};

	setBooleanField(field, value) {
		this.newData[`${ field }`] = value;
		this.submit = true;
	}

	mergeSubLayerData() {
		let subLayers = [];
		if (this.data['sub_layers']) {
			subLayers = [...this.data['sub_layers']];
		}
		if (this.newData['sub_layers']) {
			this.newData['sub_layers'].forEach(subLayer => {
				const subIdx = subLayers.findIndex(({ id }) => id === subLayer.id);
				if (subIdx > 0) {
					subLayers[subIdx] = subLayer;
				} else {
					subLayers.push(subLayer);
				}
			});
		}
		this.newData['sub_layers'] = subLayers;
	}

	pushLayer(lyr) {
		this.mergeSubLayerData();
		const subLayers = this.newData['sub_layers'];
		const subIdx = subLayers.find((sbLyr, index) => {
			return sbLyr.id === lyr.id || index;
		});
		if (subIdx > 0) {
			subLayers[subIdx] = lyr;
		} else {
			subLayers.push(lyr);
		}
	}

	removeLayer(lyr) {
		this.mergeSubLayerData();
		const subIdx = this.newData['sub_layers'].findIndex(({ id }) => id === lyr.id);
		this.newData['sub_layers'].splice(subIdx, 1);
	}

	async cancelEdition() {
		this.cleanData();
		this.displayModal = false;
		this.onClickCancel.emit();
	};

	async sendEdition() {
		this.newData['id'] = this.data['id'];
		this.submit = true;
		this.cleanData();
		this.displayModal = false;
		this.onClickSave.emit();
	};

	async cleanData() {
		this.newData = {};
		this.data = {};
	}
}
