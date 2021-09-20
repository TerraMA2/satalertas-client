import { Component, Input, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
	selector: 'app-layers-advanced-edition',
	templateUrl: './layers-advanced-edition.component.html',
})
export class LayersAdvancedEditionComponent implements OnInit {
	@Input() header: string;
	@Input() layer;
	@Input() columns;
	displayModal: boolean;
	availableLayers;
	newData = {};
	subLayers = [];
	groupedFields: Object[] = [];
	tableFields = ['name', 'description']
	edited: boolean = false;

	constructor(
		private settingsService: SettingsService,
	) {
	}

	ngOnInit(): void {
		this.settingsService.openLayersAdvancedModal.subscribe((data) => {
			const { layer, availableLayers } = data;
			this.layer = { ...layer };
			this.availableLayers = availableLayers;
			this.displayModal = true;
			this.groupColumnsByType();
			this.mergeSubLayerData(availableLayers);
			layer['subLayers'] && this.mergeSubLayerData(layer['subLayers']);
		})
	};
	groupColumnsByType() {
		this.groupedFields = this.columns.reduce((acc, column) => {
			const groupField = acc.find(fields => fields.type === column["primaryType"])
			if (!groupField) {
				acc.push({
					type: column["primaryType"],
					columns: [column]
				});
			} else {
				groupField.columns.push(column)
			}
			return acc;
		}, []);
	}

	setBooleanField(field, value) {
		this.newData[`${field}`] = value;
		this.edited = true;
	}

	mergeSubLayerData(receivedSubLayers: any[]) {
		receivedSubLayers.forEach(availableLayer => {
			const subIdx = this.subLayers.findIndex(({ id }) => id === availableLayer.id);
			if (subIdx < 0) {
				this.subLayers.push(availableLayer);
			} else {
				Object.assign(this.subLayers[subIdx], availableLayer);
			}
		})
	}

	pushLayer(lyr) {
		let subLayers = [];
		if (this.newData['subLayers']) {
			subLayers = this.newData['subLayers'];
		}
		let subIdx = subLayers.findIndex(({ id }) => id === lyr.id);
		if (subIdx >= 0) {
			Object.assign(subLayers[subIdx], lyr);
		} else {
			subLayers.push(lyr);
		}
		this.newData['subLayers'] = subLayers
		this.edited = true;
	}

	removeLayer(lyr) {
		this.newData['subLayers'] = this.newData['subLayers']
			.filter(layer => layer.id !== lyr.id);
		this.edited = true;
	}

	cancelEdition() {
		this.edited = false;
		this.clearData();
	};

	sendEdition() {
		this.newData['id'] = this.layer['id'];
		if(this.edited) {
			this.settingsService.getLayersAdvancedModalEditions.next(this.newData);
		}
		this.clearData();
	};
	
	clearData() {
		this.newData = {};
		this.availableLayers = {}
		this.layer = {};
		this.edited = false;
		this.displayModal = false;
	}
}
