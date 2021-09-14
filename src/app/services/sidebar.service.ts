import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Layer } from '../models/layer.model';
import { LayerGroup } from '../models/layer-group.model';
import { environment } from '../../environments/environment';
import { HTTPService } from './http.service';
import { Response } from '../models/response.model'

const URL_REPORT_SERVER = environment.serverUrl;

@Injectable({
	providedIn: 'root'
})
export class SidebarService {

	sidebarLayerSelect = new Subject<Layer>();

	sidebarLayerDeselect = new Subject<Layer>();

	sidebarLayerSwitchSelect = new Subject<Layer[]>();

	sidebarLayerSwitchDeselect = new Subject<Layer[]>();

	sidebarLayerGroupSelect = new Subject<LayerGroup>();

	sidebarLayerGroupDeselect = new Subject<LayerGroup>();

	sidebarItemRadioSelect = new Subject<Layer>();

	sidebarItemRadioDeselect = new Subject<Layer>();

	sidebarReload = new Subject<string>();

	sidebarLayerShowHide = new Subject<boolean>();

	sidebarAbout = new Subject<boolean>();

	sidebarLayerGroupRadioDeselect = new Subject<LayerGroup>();

	constructor(
		private httpService: HTTPService
	) {
	}

	async getSidebarLayers() {
		const url = `${ URL_REPORT_SERVER }/view/getSidebarLayers`;
		return await this.httpService.get<Response>(url).toPromise();
	}
}
