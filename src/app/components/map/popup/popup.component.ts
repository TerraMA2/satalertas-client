import { Component, OnInit } from '@angular/core';

import { MapService } from '../../../services/map.service';

import { MessageService } from 'primeng/api';

@Component({
	selector: 'app-popup',
	templateUrl: './popup.component.html',
	styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
	public layerLabel: string;
	public tableData;
	public linkSynthesis: string;
	public linkDETER: string;
	public linkPRODES: string;
	public linkFireSpot: string;
	public latLong: string;

	constructor(
		public mapService: MapService,
		public messageService: MessageService
	) {
	}

	ngOnInit() {
	}

	formatCPFCNPJ(data) {
		return this.mapService.formatterCpfCnpj(data);
	}
	copyLatLong(coordinates) {
		this.mapService.copyCoordinatesToClipboard(coordinates);
		this.messageService.add({severity: 'success', data: '', detail: 'Coordenadas copiadas!'})
	}
}
