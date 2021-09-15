import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-layers-advanced-edition',
	templateUrl: './layers-advanced-edition.component.html',
	styleUrls: ['./layers-advanced-edition.component.css']
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
	submit = false;

	constructor() {
	}

	ngOnInit(): void {
		this.mergeSubLayerData();
	};

	setBooleanField(field, value) {
		this.newData[`${field}`] = value;
		this.submit = true;
	}

	mergeSubLayerData() {
		let subLayers = [];
		if (this.data['subLayers']) {
			subLayers = [...this.data['subLayers']];
		}
		if (this.newData['subLayers']) {
			this.newData['subLayers'].forEach(subLayer => {
				const subIdx = subLayers.findIndex(({ id }) => id === subLayer.id);
				if (subIdx > 0) {
					Object.assign(subLayers[subIdx], subLayer);
				} else {
					subLayers.push(subLayer);
				}
			});
		}
		this.newData['subLayers'] = subLayers;
	}

	pushLayer(lyr) {
		this.mergeSubLayerData();
		const subLayers = this.newData['subLayers'];
		const subIdx = subLayers.findIndex(({ id }) => id === lyr.id);
		if (subIdx > 0) {
			Object.assign(subLayers[subIdx], lyr);
		} else {
			subLayers.push(lyr);
		}
	}

	removeLayer(lyr) {
		this.mergeSubLayerData();
		this.newData['subLayers'] = this.newData['subLayers']
		.filter(layer => layer.id !== lyr.id);
	}

	cancelEdition() {
		this.cleanData();
		this.displayModal = false;
		this.onClickCancel.emit();
	};

	sendEdition() {
		this.newData['id'] = this.data['id'];
		this.submit = true;
		this.cleanData();
		this.displayModal = false;
		this.onClickSave.emit();
	};

	cleanData() {
		this.newData = {};
		this.data = {};
	}
}
