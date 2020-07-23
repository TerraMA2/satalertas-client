import {Component, Input, OnInit} from '@angular/core';

import {Layer} from '../../../models/layer.model';

import {ConfigService} from '../../../services/config.service';

import {HTTPService} from '../../../services/http.service';

import {MapService} from '../../../services/map.service';

import {MessageService} from 'primeng-lts/api';

import {environment} from 'src/environments/environment';

import {FilterService} from '../../../services/filter.service';

import {View} from '../../../models/view.model';

import {LayerType} from '../../../enum/layer-type.enum';

@Component({
  selector: 'app-layer-tools',
  templateUrl: './layer-tools.component.html',
  styleUrls: ['./layer-tools.component.css']
})
export class LayerToolsComponent implements OnInit {

  @Input() displayLayerTools = false;

  @Input() layer: Layer;

  @Input() toolSelected: string;

  opacity = 100;

  formats: [];
  selectedFormats: [];

  constructor(
      private configService: ConfigService,
      private mapService: MapService,
      private httpService: HTTPService,
      private messageService: MessageService,
      private filterService: FilterService
  ) { }

  ngOnInit() {
    this.formats = this.configService.getMapConfig('export').formats;
  }

  onOpacityChange(event) {
    const layer = this.layer;
    const value = Number(event.value);
    this.mapService.layerOpactity.next({layer, value});
  }

  onSliderChange(event) {
    const layer = this.layer;
    const value = Number(event.value);
    this.mapService.layerSlider.next({layer, value});
  }

  onExportClick() {
    if (!this.selectedFormats || this.selectedFormats.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Exportação',
        detail: 'Selecione ao menos 1 formato.'
      });
      return;
    }
    const selectedFormats = this.selectedFormats;
    const layer = this.layer;
    const tableName = layer.tableName;

    const view = new View(
        layer.value,
        layer.cod,
        layer.codgroup,
        (layer.type === LayerType.ANALYSIS),
        layer.isPrimary,
        layer.tableOwner,
        layer.tableName
    );

    const { specificParameters, date, filter } = this.filterService.getParams(view);

    const url = `${environment.reportServerUrl}/export/get?specificParameters=${specificParameters}&date=${date}&filter=${filter}&fileFormats=${selectedFormats.toString()}&tableName=${tableName}`;
    const linkTag = document.createElement('a');
    linkTag.setAttribute('href', url);
    linkTag.click();
  }

  onLayerToolHide() {
    this.mapService.layerToolClose.next(this.layer);
  }

}
