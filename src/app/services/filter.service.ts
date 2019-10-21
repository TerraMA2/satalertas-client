import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filterMap = new Subject();
  filterTable = new Subject();

  constructor() { }
}
