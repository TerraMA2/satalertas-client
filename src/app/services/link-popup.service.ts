import {Injectable} from '@angular/core';
import * as L from 'leaflet';
import {ConfigService} from './config.service';
import {MapService} from './map.service';
import {Layer} from '../models/layer.model';

@Injectable({
    providedIn: 'root'
})
export class LinkPopupService {

    constructor(private configService: ConfigService,
                private mapService: MapService
    ) {
    }

    register(marker: L.Marker, link: string, title: string, primaryLayer, markerData): void {
        marker.on('click', $event => this.popup($event.target, link, title, primaryLayer, markerData));
    }

    async popup(marker: L.Marker, link: string, title: string, primaryLayer: Layer, markerData: []) {
        const infoColumns = await this.configService.getInfoColumns(primaryLayer.codgroup).then((response: Response) => response['data']);
        let popupContent = await this.mapService.getPopupContent(markerData, primaryLayer.shortLabel, infoColumns);
        const linkHtml = `
            <h3>
                <strong>
                    <a class="fas fa-file-invoice" href="${link}" routerLink="">&nbsp;${title}</a>
                </strong>
            </h3>
        `;

        popupContent = `${popupContent}${linkHtml}`;

        marker.bindPopup(popupContent, {maxWidth: 500, maxHeight: 500});
        marker.openPopup();
    }
}
