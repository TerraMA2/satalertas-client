import {ApplicationRef, ComponentFactoryResolver, Injectable, Injector} from '@angular/core';

import * as L from 'leaflet';

import {ConfigService} from './config.service';

import {PopupComponent} from '../components/map/popup/popup.component';
import {FilterService} from './filter.service';
import {View} from '../models/view.model';
import {LayerType} from '../enum/layer-type.enum';

@Injectable({
    providedIn: 'root'
})
export class PopupService {

    constructor(private cfr: ComponentFactoryResolver,
                private injector: Injector,
                private appRef: ApplicationRef,
                private configService: ConfigService,
                private filterService: FilterService
    ) {
    }

    register(marker: L.Marker, layerLabel: string, gid, codGroup, layer = null): void {
        marker.on('click', $event => this.popup($event.target, layerLabel, gid, codGroup, layer));
    }

    async popup(marker: L.Marker, layerLabel: string, gid, codGroup, layer = null) {
        const view = new View(
            layer.value,
            layer.cod,
            layer.codgroup,
            (layer.type === LayerType.ANALYSIS),
            layer.isPrimary,
            layer.tableOwner,
            layer.tableName
        );
        const filter = JSON.stringify(this.filterService.getParams(view));
        const data = await this.configService.getPopupInfo(gid, codGroup, filter).then((response: Response) => { console.log(response);  return response['data']; });
        const reportLink = '/finalReport/';
        const linkSynthesis = '/report/' + gid;
        let linkDETER = null;
        let linkPRODES = null;
        let linkBurnlight = null;
        if (codGroup === 'STATIC' || codGroup === 'CAR' || codGroup === 'DETER') {
            linkDETER = reportLink + 'deter/' + gid;
        }
        if (codGroup === 'STATIC' || codGroup === 'CAR' || codGroup === 'PRODES') {
            linkPRODES = reportLink + 'prodes/' + gid;
        }
        if (codGroup === 'STATIC' || codGroup === 'CAR' || codGroup === 'BURNED') {
            linkBurnlight = reportLink + 'queimada/' + gid;
        }

        const cmpFactory = this.cfr.resolveComponentFactory(PopupComponent);
        const componentRef = cmpFactory.create(this.injector);
        componentRef.instance.linkSynthesis = linkSynthesis;
        componentRef.instance.linkDETER = linkDETER;
        componentRef.instance.linkPRODES = linkPRODES;
        componentRef.instance.linkBurnlight = linkBurnlight;
        componentRef.instance.layerLabel = layerLabel;
        componentRef.instance.tableData = data;
        this.appRef.attachView(componentRef.hostView);

        const popupContent = componentRef.location.nativeElement;
        marker.bindPopup(popupContent, {maxWidth: 500});
        marker.openPopup();
    }
}
