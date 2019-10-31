import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  getFilteredData = new Subject();

  resetLayers = new Subject();

  clearMap = new Subject();

  reportTable = new Subject();

  showMarker = new Subject();

  constructor() { }
}
