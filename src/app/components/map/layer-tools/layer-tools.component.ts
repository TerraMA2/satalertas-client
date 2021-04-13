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
import {AuthService} from '../../../services/auth.service';
import {User} from '../../../models/user.model';

@Component({
    selector: 'app-layer-tools',
    templateUrl: './layer-tools.component.html',
    styleUrls: ['./layer-tools.component.css']
})
export class LayerToolsComponent implements OnInit {

    @Input() displayLayerTools = false;

    @Input() layer: Layer;

    @Input() toolSelected: string;

    isExportLoading = false;

    opacity = 100;

    formats: [];
    selectedFormats: [];
    disableTool = [];
    loggedUser: User = null;

    constructor(
        private configService: ConfigService,
        private mapService: MapService,
        private httpService: HTTPService,
        private messageService: MessageService,
        private filterService: FilterService,
        private exportService: ExportService,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.formats = this.configService.getMapConfig('export').formats;
        this.authService.user.subscribe((user) => {
            this.loggedUser = user;
        });
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
        const selectedFormats = this.selectedFormats;

        this.isExportLoading = true;

        if (!selectedFormats || selectedFormats.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Exportação',
                detail: 'Selecione ao menos 1 formato.'
            });
            this.isExportLoading = false;
            return;
        }

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

        const params = await this.filterService.getParams(view);
        params['fileFormats'] = selectedFormats.toString();

        await this.exportService.export(params, selectedFormats, tableName);

        this.isExportLoading = false;
    }

    onLayerToolHide() {
        this.mapService.layerToolClose.next(this.layer);
    }
}
