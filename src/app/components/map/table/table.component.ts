import { Component, OnInit, Input } from '@angular/core';

import { LazyLoadEvent } from 'primeng/api';

import { HTTPService } from 'src/app/services/http.service';

import { ConfigService } from 'src/app/services/config.service';

import { TableService } from 'src/app/services/table.service';

import { LayerType } from 'src/app/enum/layer-type.enum';

import { FilterService } from 'src/app/services/filter.service';

import { Layer } from '../../../models/layer.model';

import { LayerGroup } from 'src/app/models/layer-group.model';

import { MapService } from 'src/app/services/map.service';

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

  @Input() tableReportActive = false;

  @Input() tableHeight = '30vh';

  selectedProperties;

  selectedLayer: Layer;

  selectedLayerLabel: string;

  selectedLayerValue: number;

  loading = false;

  totalRecords = 0;

  rowsPerPage: any[];
  defaultRowsPerPage = 10;
  selectedRowsPerPage: number = this.defaultRowsPerPage;

  private tableConfig;

  constructor(
    private hTTPService: HTTPService,
    private configService: ConfigService,
    private tableService: TableService,
    private filterService: FilterService,
    private mapService: MapService
  ) { }

  ngOnInit() {
    this.tableConfig = this.configService.getMapConfig('table');

    this.tableService.loadTableData.subscribe((layer: Layer|LayerGroup) => {
      if (layer) {
        this.loading = true;
        const layerLimit = layer['limit'];
        if (layerLimit) {
          this.selectedRowsPerPage = Number(layerLimit);
        }
        this.loadTableData(layer, this.selectedRowsPerPage, 0);
      }
    });

    this.tableService.unloadTableData.subscribe((layer: Layer) => {
      if (layer) {
        if (layer.value === this.selectedLayerValue) {
          this.clearTable();
        }
      }
    });

    this.tableService.clearTable.subscribe(() => {
      this.clearTable();
    });

    this.rowsPerPage = this.tableConfig.rowsPerPage;

    this.filterService.filterTable.subscribe(filter => {
      this.tableService.loadTableData.next(this.selectedLayer);
    });

    this.filterService.filterLayerMap.subscribe(null);
  }

  loadTableData(layer,
                limit: number,
                offset: number,
                sortColumn?: string,
                sortOrder?: number
                ) {
    if (!layer) {
      return;
    }

    const url = this.configService.getAppConfig('layerUrls')[layer.type];
    const count = true;
    const date = JSON.parse(localStorage.getItem('dateFilter'));
    const viewId = layer.value;
    const params = {viewId, limit, offset, count, date};
    if (sortColumn) {
      params['sortColumn'] = sortColumn;
    }
    if (sortOrder) {
      params['sortOrder'] = sortOrder;
    }

    if (layer.type === LayerType.REPORT) {
      this.selectedLayer = layer;
      const source = layer.source;
      params['source'] = source;
      params.limit = limit;
    }

    this.hTTPService
      .get(url, params)
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

      this.rowsPerPage = this.rowsPerPage.filter((row) => row.value !== this.totalRecords);

      if (this.totalRecords > 1000) {
        this.rowsPerPage.push({
          label: this.totalRecords,
          value: this.totalRecords
        });
      }

    }
    this.loading = false;
  }

  lazyLoad(event: LazyLoadEvent) {
    this.loadTableData(
                        this.selectedLayer,
                        event.rows,
                        event.first,
                        event.sortField,
                        event.sortOrder
                      );
  }

  onSelectedLayerChange(layer) {
    this.selectedLayer = layer.selectedOption;
    this.selectedLayerLabel = this.selectedLayer.label;
    this.loading = true;
    this.loadTableData(layer.selectedOption, this.selectedRowsPerPage, 0);
  }

  onRowsPerPageChange(event) {
    this.loading = true;
    this.selectedRowsPerPage = Number(event.value);
    this.loadTableData(this.selectedLayer, this.selectedRowsPerPage, 0);
  }

  trackByFunction(index, item) {
    return index;
  }

  onShowMapClicked(rowData = null) {
    if (!rowData) {
      rowData = this.selectedProperties;
    }
    this.mapService.showMarker.next({
      layer: this.selectedLayer,
      data: rowData
    });
  }

  clearTable() {
    this.tableData = undefined;
    this.selectedLayer = undefined;
    this.selectedLayerLabel = '';
    this.selectedLayerValue = 0;
    this.selectedColumns = undefined;
    this.selectedRowsPerPage = this.defaultRowsPerPage;
    this.totalRecords = 0;
  }

  onGenerateReportClick() {

  }

}
