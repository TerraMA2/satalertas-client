import { Component, Input, OnInit } from '@angular/core';

import { Layer } from 'src/app/models/layer.model';

import { MapService } from '../../../services/map.service';

import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
	selector: 'app-legend',
	templateUrl: './legend.component.html',
	styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit {

	@Input() selectedLayers: Layer[] = [];

	@Input() displayLegend = false;

	isMobile = false;

	constructor(
		private mapService: MapService,
		private deviceDetectorService: DeviceDetectorService
	) {
	}

	ngOnInit() {
		this.isMobile = this.deviceDetectorService.isMobile();
	}

	onLegendHide() {
		this.mapService.legendClose.next();
	}

	trackById(index, item) {
		return item.id;
	}
}
