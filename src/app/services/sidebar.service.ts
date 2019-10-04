import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { Layer } from '../models/layer.model';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  sidebarItemSelect = new Subject<Layer>();

  sidebarItemUnselect = new Subject<Layer>();

  sidebarItemRadioSelect = new Subject<Layer>();

  sidebarItemRadioUnselect = new Subject<Layer>();

  sidebarClose = new Subject<any>();

  constructor() { }
}
