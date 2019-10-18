import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { LazyLoadEvent } from 'primeng/api';

import { HTTPService } from 'src/app/services/http.service';

import { ConfigService } from 'src/app/services/config.service';

import { TableService } from 'src/app/services/table.service';

import { LayerType } from 'src/app/enum/layer-type.enum';

import { FilterService } from 'src/app/services/filter.service';

import {Layer} from '../../../models/layer.model';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Input() tableData: any[] = [];

  @Input() columns: any[] = [];

  @Input() selectedColumns: any[] = [];

  @Input() selectedLayers = [];

  selectedLayer: Layer;

  selectedLayerValue: number;

  loading = false;

  totalRecords = 0;

  rowsPerPage: any[];
  defaultRowsPerPage = 10;
  selectedRowsPerPage = this.defaultRowsPerPage;

  private tableConfig;

  constructor(
    private hTTPService: HTTPService,
    private configService: ConfigService,
    private tableService: TableService,
    private filterService: FilterService
  ) { }

  ngOnInit() {
    this.tableConfig = this.configService.getConfig('map').table;

    this.tableService.loadTableData.subscribe((layer: Layer) => {
      if (layer) {
        this.loading = true;
        this.loadTableData(layer, this.selectedRowsPerPage, 0);
      }
    });

    this.tableService.unloadTableData.subscribe((layer: Layer) => {
      if (layer) {
        if (layer.value === this.selectedLayerValue) {
          this.selectedLayer = undefined;
          this.selectedLayerValue = 0;
          this.tableData = undefined;
          this.selectedColumns = undefined;
          this.selectedRowsPerPage = 10;
          this.totalRecords = 0;
        }
      }
    });

    this.rowsPerPage = this.tableConfig.rowsPerPage;

    this.filterService.filterTable.subscribe(filter => {
      this.tableService.loadTableData.next(this.selectedLayer);
    });
  }

  loadTableData(layer, limit: number, offset: number) {
    if (!layer) {
      return;
    }
    const appConfig = this.configService.getConfig('app');
    let url = '';
    if (layer.type === LayerType.ANALYSIS) {
      url = appConfig.analysisLayerUrl;
    } else if (layer.type === LayerType.STATIC) {
      url = appConfig.staticLayerUrl;
    } else if (layer.type === LayerType.DYNAMIC) {
      url = appConfig.dynamicLayerUrl;
    }
    const count = true;
    const viewId = layer.value;
    const date = JSON.parse(localStorage.getItem('dateFilter'));

    this.hTTPService
    .get(url, {viewId, limit, offset, count, date})
    .subscribe(data => this.setData(data));
  }

  setData(data) {
    if (data) {
      this.selectedColumns = [];
      this.columns = [];

      Object.keys(data[0]).forEach(key => {
        if (key !== 'lat' && key !== 'long' && key !== 'geom' && key !== 'intersection_geom') {
          this.columns.push({field: key, header: key});
        }
      });

      this.selectedColumns = this.columns;

      this.totalRecords = data.pop();
      this.tableData = data;
    }
    this.loading = false;
  }

  lazyLoad(event: LazyLoadEvent) {
    this.loadTableData(this.selectedLayer, event.rows, event.first);
  }

  onSelectedLayerChange(layer) {
    this.selectedLayer = layer.selectedOption;
    this.tableService.loadTableData.next(layer.selectedOption);
  }

  onRowsPerPageChange(event) {
    this.selectedRowsPerPage = event.value;
    this.tableService.loadTableData.next(this.selectedLayer);
  }

  trackByFunction(index, item) {
    return index;
  }

}
