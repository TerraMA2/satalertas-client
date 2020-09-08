import {Component, Input, OnInit} from '@angular/core';

import {LazyLoadEvent, MessageService} from 'primeng-lts/api';

import {HTTPService} from 'src/app/services/http.service';

import {ConfigService} from 'src/app/services/config.service';

import {TableService} from 'src/app/services/table.service';

import {FilterService} from 'src/app/services/filter.service';

import {Layer} from '../../../models/layer.model';

import {MapService} from 'src/app/services/map.service';

import {View} from '../../../models/view.model';

import {ReportService} from '../../../services/report.service';

import {Response} from '../../../models/response.model';

import {Util} from '../../../utils/util';

import {ExportService} from '../../../services/export.service';
import {LayerType} from '../../../enum/layer-type.enum';

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

    @Input() tableHeight;

    selectedProperties;

    selectedLayer;
    selectedLayerLabel: string;
    selectedLayerValue: number;

    isLoading = false;

    totalRecords = 0;

    rowsPerPage: any[];
    defaultRowsPerPage = 10;
    selectedRowsPerPage: number = this.defaultRowsPerPage;

    filters: object | any[];
    selectedFilter;
    selectedFilterValue: string;
    selectedFilterSortField: string;
    selectedFilterLabel: string;

    showBurn = false;
    showDeter = false;
    showProdes = false;

    isExportDisabled = true;

    reports = [];
    formats;
    selectedFormats: [];
    private tableConfig;

    constructor(
        private hTTPService: HTTPService,
        private configService: ConfigService,
        private tableService: TableService,
        private filterService: FilterService,
        private mapService: MapService,
        private reportService: ReportService,
        private messageService: MessageService,
        private exportService: ExportService
    ) {
    }

    async ngOnInit() {
        this.tableConfig = this.configService.getMapConfig('table');

        this.formats = this.configService.getMapConfig('export').formats;

        this.rowsPerPage = this.tableConfig.rowsPerPage;

        this.tableService.loadTableData.subscribe(layer => {
            if (layer) {
                this.isLoading = true;
                this.loadTableData(layer, this.selectedRowsPerPage, 0);
            }
        });

        this.tableService.unloadTableData.subscribe((layer: Layer) => {
            if (layer && layer.value === this.selectedLayerValue) {
                this.clearTable();
            }
        });

        this.filters = await this.configService.getReportLayers().then((reportLayer: Response) => reportLayer.data);

        this.tableService.loadReportTableData.subscribe(() => {
            this.showBurn = true;
            this.showProdes = true;
            this.showDeter = true;
            this.isLoading = true;
            const selectedOption = this.filters[0];
            this.selectedLayer = selectedOption;
            this.selectedFilter = selectedOption;
            this.selectedFilterValue = selectedOption.value;
            // this.selectedLayerValue = selectedOption.value;
            this.selectedFilterSortField = selectedOption.sortField;
            this.loadTableData(selectedOption, this.selectedRowsPerPage, 0, this.selectedFilterSortField, 1);
        });

        this.tableService.clearTable.subscribe(() => this.clearTable());

        this.filterService.filterTable.subscribe(() => this.tableService.loadTableData.next(this.selectedLayer));
    }

    async loadTableData(layer,
                        limit: number,
                        offset: number,
                        sortField?: string,
                        sortOrder?: number
    ) {
        if (!layer) {
            return;
        }
        this.isLoading = true;

        const url = this.configService.getAppConfig('layerUrls')[layer.type];
        const countTotal = true;

        const view = JSON.stringify(
            new View(
                layer.value,
                layer.cod,
                layer.cod_group ? layer.cod_group : layer.codgroup,
                layer.is_dynamic ? layer.is_dynamic : layer.type === 'analysis',
                layer.isPrimary === undefined ? true : layer.isPrimary,
                layer.table_owner ? layer.table_owner : layer.tableOwner,
                layer.table_name ? layer.table_name : layer.tableName
            )
        );

        this.showDeter =
            ((layer.cod_group === 'DETER') ||
                (layer.cod_group === 'CAR'));

        this.showProdes =
            ((layer.cod_group === 'PRODES') ||
                (layer.cod_group === 'CAR'));
        this.showBurn =
            ((layer.cod_group === 'BURNED_AREA') ||
                (layer.cod_group === 'BURNED') ||
                (layer.cod_group === 'CAR'));
        const params = {view, limit, offset, countTotal};

        if (this.selectedFilter) {
            params['count'] = this.selectedFilter.count;
            params['sum'] = this.selectedFilter.sum;
            params['isDynamic'] = this.selectedFilter.is_dynamic;
            params['tableAlias'] = this.selectedFilter.table_alias;
            params['sumAlias'] = this.selectedFilter.sum_alias;
            params['countAlias'] = this.selectedFilter.count_alias;
            params['sumField'] = this.selectedFilter.sum_field;
        }

        params['sortField'] = sortField ? sortField : this.selectedFilter && this.selectedFilter.sort_field ? this.selectedFilter.sort_field : undefined;
        params['sortOrder'] = sortOrder ?  sortOrder : 1;

        await this.hTTPService
            .get(url, this.filterService.getParams(params))
            .subscribe(async data => await this.setData(data, layer.cod_group ? layer.cod_group : layer.codgroup));
    }

    async setData(data, group) {
        if (data) {
            this.selectedColumns = [];
            this.columns = [];
            this.totalRecords = data.pop();

            if (data[0]) {
                if (!this.tableReportActive) {
                    const infoColumns = await this.configService.getInfoColumns().then((response: Response) => response.data);
                    const changedData = [];
                    Object.keys(data[0]).forEach(key => {
                        const column = infoColumns && infoColumns[group] ? infoColumns[group][key] : '';
                        const show = column ? column.show : false;
                        const alias = column ? column.alias : key;
                        if (show === true) {
                            this.columns.push({field: alias, header: alias, sortColumn: key});
                        }
                    });
                    Object.keys(data).forEach(dataKey => {
                        const dataValue = data[dataKey];
                        const changedRow = [];
                        Object.entries(dataValue).forEach(e => {
                            const key = e[0];
                            if (key !== 'lat' && key !== 'long') {
                                const value = e[1];
                                if (infoColumns[group][key] && infoColumns[group][key].alias && infoColumns[group][key].alias !== undefined) {
                                    changedRow[infoColumns[group][key].alias] = value;
                                } else {
                                    changedRow[key] = value;
                                }
                            }
                        });
                        changedData.push(changedRow);
                    });
                    data = changedData;
                } else {
                    Object.keys(data[0]).forEach(key => {
                        if (key !== 'lat' && key !== 'long' && key !== 'geom' && key !== 'intersection_geom' && key !== 'has_pdf') {
                            this.columns.push({field: key, header: key, sortColumn: key});
                        }
                    });
                }
            }

            this.selectedColumns = this.columns;

            this.tableData = data;

            this.rowsPerPage = this.rowsPerPage.filter((row) => row.value !== this.totalRecords);

            if (this.totalRecords > 1000) {
                this.rowsPerPage.push({
                    label: this.totalRecords,
                    value: this.totalRecords
                });
            }

        }
        this.isLoading = false;
    }

    onLazyLoad(event: LazyLoadEvent) {
        this.loadTableData(this.selectedLayer,
            event.rows,
            event.first,
            this.getSortField(event.sortField),
            event.sortOrder
        );
    }

    getSortField(sortField) {
        let sortColumn = '';
        for (const column of this.selectedColumns) {
            if (sortField === column['field'] ) {
                sortColumn = column['sortColumn'];
            }
        }
        return sortColumn;
    }

    onSelectedLayerChange(layer) {
        this.selectedLayer = layer.selectedOption;
        this.selectedLayerLabel = this.selectedLayer.label;
        this.loadTableData(layer.selectedOption, this.selectedRowsPerPage, 0);
    }

    onRowsPerPageChange(event) {
        this.loadTableData(this.selectedLayer, this.selectedRowsPerPage, 0);
    }

    async onRowExpand(event) {
        const register = event.data.gid;
        const reportResp = await this.reportService.getReportsByCARCod(register).then((response: Response) => response);

        this.reports = (reportResp.status === 200) ? reportResp.data : [];
    }

    onFilterChange(filter) {
        const selectedOption = filter.selectedOption;
        this.selectedLayer = selectedOption;
        this.selectedFilter = selectedOption;
        this.selectedFilterLabel = selectedOption.label;
        this.loadTableData(selectedOption, this.selectedRowsPerPage, 0, selectedOption.sort_field, 1);
    }

    trackById(index, item) {
        return item.field;
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
        // this.selectedLayer = undefined;
        this.selectedFilterValue = undefined;
        // this.selectedLayerLabel = '';
        this.selectedLayerValue = 0;
        this.selectedColumns = undefined;
        this.selectedRowsPerPage = this.defaultRowsPerPage;
        this.totalRecords = 0;
    }

    async onExportClick() {
        const selectedFormats = this.selectedFormats;

        this.isLoading = true;

        if (!selectedFormats || selectedFormats.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Exportação',
                detail: 'Selecione ao menos 1 formato.'
            });
            this.isLoading = false;
            return;
        }

        const layer = this.selectedFilter;

        const view = new View(
            layer.value,
            layer.label.toUpperCase().replace(' ', '_'),
            layer.cod_group,
          layer.cod_group !== 'CAR',
            true,
            layer.table_name,
            layer.table_name
        );

        const params = await this.filterService.getParams(view);
        const selectedProperties = this.selectedProperties;

        const selectedGids = [];
        selectedProperties.forEach((selectedProperty) => {
            selectedGids.push(selectedProperty.gid);
        });

        params['fileFormats'] = selectedFormats.toString();
        params['selectedGids'] = selectedGids.toString();

        await this.exportService.export(params, selectedFormats, layer.table_name);

        this.isLoading = false;
    }

    getReport(report) {
        this.isLoading = true;
        this.reportService.getReportById(report.id).then((response: Response) => {
            const reportResp = (response.status === 200) ? response.data : {};

            window.open(window.URL.createObjectURL(Util.base64toBlob(reportResp.base64, 'application/pdf')));
            this.isLoading = false;
        });
    }

    onRowSelect() {
        this.isExportDisabled = false;
    }

    onRowUnselect() {
        if (this.selectedProperties.length === 0) {
            this.isExportDisabled = true;
        }
    }

    onHeaderCheckboxToggle(event) {
        const checked = event.checked;
        if (checked && this.isExportDisabled) {
            this.isExportDisabled = false;
        } else if (!checked) {
            this.isExportDisabled = true;
        }
    }

    getRegister(data) {
        return data['gid'];
    }
}
