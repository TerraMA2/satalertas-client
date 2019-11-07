import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { Layer } from '../models/layer.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filterMap = new Subject();
  filterTable = new Subject();
  filterDashboard = new Subject();

  displayFilter = new Subject();

  filterReport = new Subject<Layer>();
  filterLayerMap = new Subject<Layer>();

  constructor() { }
}
