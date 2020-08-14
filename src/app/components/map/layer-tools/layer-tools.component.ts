import {Component, Input, OnInit} from '@angular/core';

import {Layer} from '../../../models/layer.model';

import {ConfigService} from '../../../services/config.service';

import {HTTPService} from '../../../services/http.service';

import {MapService} from '../../../services/map.service';

import {MessageService} from 'primeng-lts/api';

import {FilterService} from '../../../services/filter.service';

import {View} from '../../../models/view.model';

import {LayerType} from '../../../enum/layer-type.enum';

import {ExportService} from '../../../services/export.service';
import {Response} from '../../../models/response.model';

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
      private filterService: FilterService,
      private exportService: ExportService
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

  async onExportClick() {
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

    const params = this.filterService.getParams(view);
    params['fileFormats'] = selectedFormats.toString();
    params['tableName'] = layer.tableName;

    await this.exportService.getExport(params).then((response: Response) => {
      const exportResp = (response.status === 200) ? response.data : {};

      let mimeType = '';
      if (selectedFormats.length > 1) {
        mimeType = 'application/zip';
      } else {
        // @ts-ignore
        if (selectedFormats[0] === 'csv') {
          mimeType = 'text/csv';
          // @ts-ignore
        } else if (selectedFormats[0] === 'kml') {
          mimeType = 'application/vnd.google-earth.kml+xml';
          // @ts-ignore
        } else if (selectedFormats[0] === 'geojson') {
          mimeType = 'application/vnd.google-earth.geo+json';
          // @ts-ignore
        } else if (selectedFormats[0] === 'shapefile') {
          mimeType = 'application/zip';
        }
      }

      window.open(window.URL.createObjectURL(this.base64toBlob(exportResp, mimeType)));
    });

    // const url = `${environment.reportServerUrl}/export/get?specificParameters=${specificParameters}&date=${date}&filter=${filter}&fileFormats=${selectedFormats.toString()}&tableName=${tableName}`;
    // const linkTag = document.createElement('a');
    // linkTag.setAttribute('id', 'exportLink');
    // linkTag.setAttribute('download', 'download');
    // linkTag.setAttribute('href', url);
    // linkTag.click();
  }

  base64toBlob(content, contentType) {
    contentType = contentType || '';

    const sliceSize = 512;

    const byteCharacters = window.atob(content);

    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {
      type: contentType
    });
  }

  onLayerToolHide() {
    this.mapService.layerToolClose.next(this.layer);
  }

}
