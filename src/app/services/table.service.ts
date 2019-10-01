import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  loadTableData = new Subject<object>();

  unloadTableData = new Subject<object>();

  constructor() { }
}
