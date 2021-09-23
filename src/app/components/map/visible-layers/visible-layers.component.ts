import { Component, Input, OnInit } from '@angular/core';

import { Layer } from 'src/app/models/layer.model';

import { MapService } from 'src/app/services/map.service';

import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
	selector: 'app-visible-layers',
	templateUrl: './visible-layers.component.html',
	styleUrls: ['./visible-layers.component.css']
})
export class VisibleLayersComponent implements OnInit {

	draggedItem: Layer;

	@Input() selectedLayers: Layer[] = [];

	@Input() displayVisibleLayers = false;

	cols;

	isMobile = false;

	constructor(
		private mapService: MapService,
		private deviceDetectorService: DeviceDetectorService
	) {
	}

	ngOnInit() {
		this.isMobile = this.deviceDetectorService.isMobile();
		this.cols = [{
			field: '',
			header: ''
		}];
	}

	trackById(index, item) {
		return item.id;
	}

	dragStart(event, item: Layer) {
		this.draggedItem = item;
	}

	drop(event) {
		if (this.draggedItem) {
			let draggedItemIndex = this.selectedLayers.findIndex(child => child.name === this.draggedItem.name);

			const itemDraggedToLabel = event.target.innerText;
			let itemDraggedToIndex = this.selectedLayers.findIndex(child => child.name === itemDraggedToLabel);
			const itemDraggedTo = this.selectedLayers[itemDraggedToIndex];

			this.selectedLayers = this.selectedLayers.filter((child) => child.name !== this.draggedItem.name);

			this.selectedLayers = [
				...this.selectedLayers.slice(0, itemDraggedToIndex),
				this.draggedItem,
				...this.selectedLayers.slice(itemDraggedToIndex)
			];

			const items = [];

			itemDraggedToIndex += 1000;
			draggedItemIndex += 1000;
			items.push({ item: this.draggedItem, index: draggedItemIndex });
			items.push({ item: itemDraggedTo, index: itemDraggedToIndex });
			items.push({ selectedLayers: this.selectedLayers });
			this.mapService.resetLayers.next(items);
		}
	}

	dragEnd(event) {
		this.draggedItem = null;
	}

}
