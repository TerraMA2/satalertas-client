import { Component, Input } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-layer-table',
  templateUrl: './layer-table.component.html',
  styleUrls: [ './layer-table.component.css']
})

export class LayerTableComponent {
  @Input() layers;
  @Input() columns: any[];
  
  constructor(
    private settingsService: SettingsService
    ) {}

  editLayer(layerToEdit) {
    this.settingsService.openLayersAdvancedModal.next({
      layer: { ...layerToEdit },
      availableLayers: this.layers.filter((item) =>
        item.viewId !== layerToEdit.viewId)
        .filter(item => !item.isPrimary)
    })
  };
}
