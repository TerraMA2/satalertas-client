import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';

import {Layer} from '../models/layer.model';

@Injectable({
    providedIn: 'root'
})
export class TableService {

    loadTableData = new Subject();

    unloadTableData = new Subject<Layer>();

    loadReportTableData = new Subject();

    clearTable = new Subject();

    constructor() {
    }
}
