import {ApplicationRef, ComponentFactoryResolver, Injectable, Injector} from '@angular/core';

import * as L from 'leaflet';

import {ConfigService} from './config.service';

import {PopupComponent} from '../components/map/popup/popup.component';

@Injectable({
    providedIn: 'root'
})
export class PopupService {

    constructor(private cfr: ComponentFactoryResolver,
                private injector: Injector,
                private appRef: ApplicationRef,
                private configService: ConfigService
    ) {
    }

    register(marker: L.Marker, layerLabel: string, gid, codGroup, link: string): void {
        marker.on('click', $event => this.popup($event.target, layerLabel, gid, codGroup, link));
    }

    async popup(marker: L.Marker, layerLabel: string, gid, codGroup, link: string) {
        const data = await this.configService.getPopupInfo(gid, codGroup).then((response: Response) => response['data']);

        const cmpFactory = this.cfr.resolveComponentFactory(PopupComponent);
        const componentRef = cmpFactory.create(this.injector);
        componentRef.instance.link = link;
        componentRef.instance.layerLabel = layerLabel;
        componentRef.instance.tableData = data;
        this.appRef.attachView(componentRef.hostView);

        const popupContent = componentRef.location.nativeElement;
        marker.bindPopup(popupContent, {maxWidth: 500});
        marker.openPopup();
    }
}
