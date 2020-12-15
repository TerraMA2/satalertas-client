import {Component, Input, OnInit} from '@angular/core';

import {Layer} from 'src/app/models/layer.model';

import {MapService} from 'src/app/services/map.service';

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

    constructor(
        private mapService: MapService
    ) {
    }

    ngOnInit() {
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
            let draggedItemIndex = this.selectedLayers.findIndex(child => child.label === this.draggedItem.label);

            const itemDraggedToLabel = event.target.innerText;
            let itemDraggedToIndex = this.selectedLayers.findIndex(child => child.label === itemDraggedToLabel);
            const itemDraggedTo = this.selectedLayers[itemDraggedToIndex];

            this.selectedLayers[draggedItemIndex] = this.selectedLayers.splice(itemDraggedToIndex, 1, this.selectedLayers[draggedItemIndex])[0];

            const items = [];

            itemDraggedToIndex += 1001;
            draggedItemIndex += 1001;

            items.push({item: this.draggedItem, index: draggedItemIndex});
            items.push({item: itemDraggedTo, index: itemDraggedToIndex});
            this.mapService.resetLayers.next(items);
        }
    }

    dragEnd(event) {
        this.draggedItem = null;
    }

}
