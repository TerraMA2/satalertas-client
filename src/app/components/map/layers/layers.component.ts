import { Component, OnInit, Input } from '@angular/core';

import { Layer } from 'src/app/models/layer.model';

import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.css']
})
export class LayersComponent implements OnInit {

  draggedItem: Layer;

  @Input() selectedLayers = [];

  @Input() displayLayers = false;

  @Input() displayControls;

  constructor(
    private mapService: MapService
  ) { }

  ngOnInit() {
  }

  trackByFunction(index, item) {
    return index;
  }

  dragStart(event, item: Layer) {
    this.draggedItem = item;
  }

  drop(event) {
    if (this.draggedItem) {
      const draggedItemIndex = this.selectedLayers.findIndex(child => child.label === this.draggedItem.label);

      const itemDraggedToLabel = event.target.innerText;
      let itemDraggedToIndex = this.selectedLayers.findIndex(child => child.label === itemDraggedToLabel);
      const itemDraggedTo = this.selectedLayers[itemDraggedToIndex];

      this.selectedLayers.splice(draggedItemIndex, 1);
      this.selectedLayers.splice(itemDraggedToIndex, 0, this.draggedItem);

      const items = [];

      itemDraggedToIndex++;

      items.push({item: this.draggedItem, index: 1000 + itemDraggedToIndex});
      items.push({item: itemDraggedTo, index: 1000 + (itemDraggedToIndex + 1)});
      this.mapService.resetLayers.next(items);
    }
  }

  dragEnd(event) {
    this.draggedItem = null;
  }

}
