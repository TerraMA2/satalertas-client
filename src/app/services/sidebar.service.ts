import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';

import {Layer} from '../models/layer.model';

import {LayerGroup} from '../models/layer-group.model';

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

    sidebarReload = new Subject<boolean>();

    sidebarLayerShowHide = new Subject<boolean>();

    sidebarAbout = new Subject<boolean>();

    sidebarLayerGroupRadioDeselect = new Subject<LayerGroup>();

    constructor() {
    }

}
