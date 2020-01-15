import { Component, OnInit, Input } from '@angular/core';

import { LazyLoadEvent } from 'primeng/api';

import { HTTPService } from 'src/app/services/http.service';

import { ConfigService } from 'src/app/services/config.service';

import { TableService } from 'src/app/services/table.service';

import { FilterService } from 'src/app/services/filter.service';

import { Layer } from '../../../models/layer.model';

import { MapService } from 'src/app/services/map.service';

import { View } from '../../../models/view.model';

import { LayerType } from 'src/app/enum/layer-type.enum';

import { ReportService } from '../../../services/report.service';

import { Response } from '../../../models/response.model';

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
  selectedFilter;
  selectedFilterValue: string;
  selectedFilterSortField: string;

  reports = [];

  private tableConfig;

  constructor(
    private hTTPService: HTTPService,
    private configService: ConfigService,
    private tableService: TableService,
    private filterService: FilterService,
    private mapService: MapService,
    private reportService: ReportService
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
      this.selectedLayer = selectedOption;
      this.selectedFilter = selectedOption;
      this.selectedFilterValue = selectedOption.value;
      this.selectedLayerValue = selectedOption.value;
      this.selectedFilterSortField = selectedOption.sortField;
      this.loadTableData(selectedOption, this.selectedRowsPerPage, 0, this.selectedFilterSortField, 1);
    });

    this.tableService.clearTable.subscribe(() => this.clearTable());

    this.filterService.filterTable.subscribe(() => this.tableService.loadTableData.next(this.selectedLayer));
  }

  loadTableData(layer,
                limit: number,
                offset: number,
                sortField?: string,
                sortOrder?: number
  ) {
    if (!layer) {
      return;
    }

    const url = this.configService.getAppConfig('layerUrls')[layer.type];
    const countTotal = true;

    const view = JSON.stringify(
      new View(
        layer.value,
        layer.cod,
        layer.codgroup,
        (layer.type === LayerType.ANALYSIS || this.tableReportActive),
        (layer.isPrimary || this.tableReportActive)
      ));

    const params = {view, limit, offset, countTotal};

    if (sortField) {
      params['sortField'] = sortField;
    }
    if (sortOrder) {
      params['sortOrder'] = sortOrder;
    }

    if (this.selectedFilter) {
      params['count'] = this.selectedFilter.count;
      params['sum'] = this.selectedFilter.sum;
      params['isDynamic'] = this.selectedFilter.isDynamic;
      params['tableAlias'] = this.selectedFilter.tableAlias;
      params['sumAlias'] = this.selectedFilter.sumAlias;
      params['countAlias'] = this.selectedFilter.countAlias;
      params['sumField'] = this.selectedFilter.sumField;
      params['sortField'] = this.selectedFilter.sortField;
    }

    this.hTTPService
      .get(url, this.filterService.getParams(params))
      .subscribe(data => this.setData(data));
  }

  setData(data) {
    if (data) {
      this.selectedColumns = [];
      this.columns = [];

      if (!this.tableReportActive) {
        const infoColumns = this.selectedLayer.infoColumns;
        Object.keys(data[0]).forEach(key => {
          // const column = infoColumns[key];
          // const show = column.show;
          // const alias = column.alias;
          // if (show) {
            this.columns.push({field: key, header: key});
          // }
        });
      } else {
        Object.keys(data[0]).forEach(key => {
          if (key !== 'lat' && key !== 'long' && key !== 'geom' && key !== 'intersection_geom') {
            this.columns.push({field: key, header: key});
          }
        });
      }

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

  onLazyLoad(event: LazyLoadEvent) {
    this.loadTableData(this.selectedLayer,
                      event.rows,
                      event.first,
                      event.sortField,
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
    this.loadTableData(this.selectedLayer, this.selectedRowsPerPage, 0);
  }

  async onRowExpand(event) {

    const reportResp = await this.reportService.getReportsByCARCod(event.data.registro_federal).then( (response: Response) => response );

    this.reports = (reportResp.status === 200) ? reportResp.data : [];

    const carRegister = event.data.registro_estadual;
  }

  onFilterChange(filter) {
    this.loading = true;
    const selectedOption = filter.selectedOption;
    this.selectedLayer = selectedOption;
    this.selectedFilter = selectedOption;
    this.loadTableData(selectedOption, this.selectedRowsPerPage, 0, selectedOption.sortField, 1);
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
    this.selectedFilterValue = undefined;
    this.selectedLayerLabel = '';
    this.selectedLayerValue = 0;
    this.selectedColumns = undefined;
    this.selectedRowsPerPage = this.defaultRowsPerPage;
    this.totalRecords = 0;
  }

  onGenerateReportClick(rowData) {
    if (!rowData) {
      const selectedProperties = this.selectedProperties;
    }
  }

  getReport(report) {
    this.reportService.getReportById(report.id).then( (response: Response) => {
      const reportResp = (response.status === 200) ? response.data : {};

      window.open(window.URL.createObjectURL(this.base64toBlob(reportResp.base64, 'application/pdf')));
    });

  }

  base64toBlob(content, contentType) {
    contentType = contentType || '';

    const sliceSize = 512;

    const byteCharacters = window.atob(content);

    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {
      type: contentType
    });

    return blob;
  }
}
