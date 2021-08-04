import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';

import * as L from 'leaflet';

import { ConfigService } from './config.service';

import { PopupComponent } from '../components/map/popup/popup.component';

import { FilterService } from './filter.service';

import { View } from '../models/view.model';

import { LayerType } from '../enum/layer-type.enum';
import { MapService } from './map.service';

@Injectable({
	providedIn: 'root'
})
export class PopupService {

	constructor(private cfr: ComponentFactoryResolver,
	            private injector: Injector,
	            private appRef: ApplicationRef,
	            private configService: ConfigService,
	            private filterService: FilterService,
	            private mapService: MapService
	) {
	}

	register(marker: L.Marker, layerLabel: string, gid, codGroup, layer?): void {
		marker.on('click', $event => this.popup($event.target, layerLabel, gid, codGroup, layer));
	}

	async popup(marker: L.Marker, layerLabel: string, gid, codGroup, layer?) {
		let filter = null;
		if (layer) {
			const view = new View(
				layer.value,
				layer.cod,
				layer.codgroup,
				(layer.type === LayerType.ANALYSIS),
				layer.isPrimary,
				layer.tableOwner,
				layer.tableName
			);
			filter = JSON.stringify(this.filterService.getParams(view));
		}
		const data = await this.mapService.getPopupInfo(gid, codGroup, filter).then(response => response);
		const reportLink = '/reports/';
		const linkSynthesis = '/synthesis/' + gid;
		let linkDETER = reportLink + 'deter/' + gid;
		let linkPRODES = reportLink + 'prodes/' + gid;
		let linkFireSpot = reportLink + 'queimada/' + gid;
		switch (codGroup) {
			case 'DETER':
				layerLabel += ' - DETER';
				linkPRODES = '';
				linkFireSpot = '';
				break;
			case 'PRODES':
				layerLabel += ' - PRODES';
				linkDETER = '';
				linkFireSpot = '';
				break;
			case 'BURNED':
				layerLabel += ' - FOCOS';
				linkDETER = '';
				linkPRODES = '';
				break;
		}

		const cmpFactory = this.cfr.resolveComponentFactory(PopupComponent);
		const componentRef = cmpFactory.create(this.injector);
		componentRef.instance.linkSynthesis = linkSynthesis;
		componentRef.instance.linkDETER = linkDETER;
		componentRef.instance.linkPRODES = linkPRODES;
		componentRef.instance.linkFireSpot = linkFireSpot;
		componentRef.instance.layerLabel = layerLabel;
		componentRef.instance.tableData = data;
		this.appRef.attachView(componentRef.hostView);

		const popupContent = componentRef.location.nativeElement;
		marker.bindPopup(popupContent, { maxWidth: 500 });
		marker.openPopup();
	}
}
