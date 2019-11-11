import { Component, OnInit, Input } from '@angular/core';

import { LazyLoadEvent } from 'primeng/api';

import { HTTPService } from 'src/app/services/http.service';

import { ConfigService } from 'src/app/services/config.service';

import { TableService } from 'src/app/services/table.service';

import { FilterService } from 'src/app/services/filter.service';

import { Layer } from '../../../models/layer.model';

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

  @Input() selectedLayers: Layer[] = [];

  @Input() tableReportActive = false;

  @Input() tableHeight = '30vh';

  selectedProperties;

  selectedLayer;

  selectedLayerLabel: string;

  selectedLayerValue: number;

  loading = false;

  totalRecords = 0;

  rowsPerPage: any[];
  defaultRowsPerPage = 10;
  selectedRowsPerPage: number = this.defaultRowsPerPage;

  filters: any[];
  selectedFilter: object;
  selectedFilterValue: string;
  selectedFilterSource: string;

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

    this.rowsPerPage = this.tableConfig.rowsPerPage;

    this.tableService.loadTableData.subscribe(layer => {
      if (layer) {
        this.loading = true;
        this.loadTableData(layer, this.selectedRowsPerPage, 0);
      }
    });

    this.tableService.unloadTableData.subscribe((layer: Layer) => {
      if (layer && layer.value === this.selectedLayerValue) {
        this.clearTable();
      }
    });

    this.tableService.loadReportTableData.subscribe(() => {
      this.loading = true;
      this.filters = this.configService.getMapConfig('table').reportLayers;
      const selectedOption = this.filters[0];
      this.selectedFilter = selectedOption;
      this.selectedLayer = selectedOption;
      this.selectedFilterValue = selectedOption.value;
      this.selectedLayerValue = selectedOption.value;
      this.selectedFilterSource = selectedOption.source;
      this.loadTableData(this.filters[0], this.selectedRowsPerPage, 0, this.selectedFilterSource);
    });

    this.tableService.clearTable.subscribe(() => this.clearTable());

    this.filterService.filterTable.subscribe(() => this.tableService.loadTableData.next(this.selectedLayer));
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

    if (this.selectedFilterSource) {
      sortColumn = this.selectedFilterSource;
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
    let sortField = event.sortField;
    if (this.selectedFilterSource) {
      sortField = this.selectedFilterSource;
    }
    this.loadTableData(this.selectedLayer,
                      event.rows,
                      event.first,
                      sortField,
                      event.sortOrder
    );
  }

  onSelectedLayerChange(layer) {
    this.loading = true;
    this.selectedLayer = layer.selectedOption;
    this.selectedLayerLabel = this.selectedLayer.label;
    this.loadTableData(layer.selectedOption, this.selectedRowsPerPage, 0);
  }

  onRowsPerPageChange(event) {
    this.loading = true;
    let sortField = null;
    if (this.selectedFilterSource) {
      sortField = this.selectedFilterSource;
    }
    this.loadTableData(this.selectedLayer, this.selectedRowsPerPage, 0, sortField);
  }

  onFilterChange(filter) {
    this.loading = true;
    const selectedOption = filter.selectedOption;
    this.selectedFilter = selectedOption;
    this.selectedLayer = selectedOption;
    this.selectedFilterSource = selectedOption.source;
    this.loadTableData(selectedOption, this.selectedRowsPerPage, 0, this.selectedFilterSource);
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
    this.selectedFilter = undefined;
    this.selectedFilterValue = undefined;
    this.selectedLayerLabel = '';
    this.selectedLayerValue = 0;
    this.selectedColumns = undefined;
    this.selectedRowsPerPage = this.defaultRowsPerPage;
    this.totalRecords = 0;
  }

  onGenerateReportClick() {

  }

}
