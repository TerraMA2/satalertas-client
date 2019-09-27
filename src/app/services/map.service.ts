import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  getFilteredData = new Subject<any[]>();

  resetLayers = new Subject<any[]>();

  constructor() { }
}
