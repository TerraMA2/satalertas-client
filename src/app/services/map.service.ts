import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { Layer } from '../models/layer.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  resetLayers = new Subject();

  clearMap = new Subject();

  reportTable = new Subject();

  showMarker = new Subject();

  reportTableButton = new Subject<boolean>();

  layerToolOpen = new Subject<object>();

  layerToolClose = new Subject();

  legendClose = new Subject();

  layerExtent = new Subject<Layer>();

  layerOpactity = new Subject<object>();

  layerSlider = new Subject<object>();

  clearMarkers = new Subject();

  constructor() { }
}
