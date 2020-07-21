import {Component, Input, OnInit} from '@angular/core';
import {Layer} from '../../../models/layer.model';
import {ConfigService} from '../../../services/config.service';
import {HTTPService} from '../../../services/http.service';
import {MapService} from '../../../services/map.service';
import {MessageService} from 'primeng-lts/api';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-layer-tools',
  templateUrl: './layer-tools.component.html',
  styleUrls: ['./layer-tools.component.css']
})
export class LayerToolsComponent implements OnInit {

  @Input() displayLayerTools = false;

  @Input() layer: Layer;

  @Input() toolSelected: string;

  opacity: number;

  formats: [];
  selectedFormats: [];

  constructor(
      private configService: ConfigService,
      private mapService: MapService,
      private httpService: HTTPService,
      private messageService: MessageService
  ) { }

  ngOnInit() {
    this.formats = this.configService.getMapConfig('export').formats;
  }

  onOpacityChange(event) {

  }

  onExportClick() {
    if (!this.selectedFormats || this.selectedFormats.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Exportação',
        detail: 'Selecione ao menos 1 formato.'
      });
    }
    const selectedFormats = this.selectedFormats;
    const tableName = this.layer.tableName;

    const url = `${environment.reportServerUrl}/export/get?fileFormats=${selectedFormats.toString()}&tableName=${tableName}`;
    const linkTag = document.createElement('a');
    linkTag.setAttribute('href', url);
    linkTag.click();
  }

  onLayerToolHide() {
    this.mapService.layerToolClose.next();
  }

}
