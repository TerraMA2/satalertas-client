import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  loadFilterData = new Subject<any[]>();

  loadTableData = new Subject<object>();

  unloadTableData = new Subject<object>();

  constructor() { }
}
