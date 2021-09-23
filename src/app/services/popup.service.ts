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

	register(marker: L.Marker, layerLabel: string, gid, groupCode, layer?): void {
		marker.on('click', $event => this.popup($event.target, layerLabel, gid, groupCode, layer));
	}

	async popup(marker: L.Marker, layerLabel: string, gid, groupCode, layer?) {
		const latLong = marker.getLatLng();
		let filter = null;
		if (layer) {
			const view = new View(
				layer.value,
				layer.code,
				layer.groupCode,
				(layer.type === LayerType.ANALYSIS),
				layer.isPrimary,
				layer.tableOwner,
				layer.tableName
			);
			filter = JSON.stringify(this.filterService.getParams(view));
		}
		const data = await this.mapService.getPopupInfo(gid, groupCode, filter).then(response => response.data);
		const reportLink = '/reports/';
		const linkSynthesis = '/synthesis/' + gid;
		let linkDETER = reportLink + 'deter/' + gid;
		let linkPRODES = reportLink + 'prodes/' + gid;
		let linkFireSpot = reportLink + 'queimada/' + gid;
		switch (groupCode) {
			case 'DETER':
				layerLabel += ' - DETER';
				linkPRODES = undefined;
				linkFireSpot = undefined;
				break;
			case 'PRODES':
				layerLabel += ' - PRODES';
				linkDETER = undefined;
				linkFireSpot = undefined;
				break;
			case 'BURNED':
				layerLabel += ' - FOCOS';
				linkDETER = undefined;
				linkPRODES = undefined;
				break;
			default:
				layerLabel += '';
				linkDETER = undefined;
				linkPRODES = undefined;
				linkFireSpot = undefined;
				break;
		}

		const latLongText = `${latLong.lat}, ${latLong.lng}`;
		const cmpFactory = this.cfr.resolveComponentFactory(PopupComponent);
		const componentRef = cmpFactory.create(this.injector);
		componentRef.instance.linkSynthesis = linkSynthesis;
		componentRef.instance.linkDETER = linkDETER;
		componentRef.instance.linkPRODES = linkPRODES;
		componentRef.instance.linkFireSpot = linkFireSpot;
		componentRef.instance.layerLabel = layerLabel;
		componentRef.instance.tableData = data;
		componentRef.instance.latLong = latLongText;
		this.appRef.attachView(componentRef.hostView);

		const popupContent = componentRef.location.nativeElement;
		marker.bindPopup(popupContent, { maxWidth: 500 });
		marker.openPopup();
	}
}
