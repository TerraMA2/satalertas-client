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

import {ReportLayer} from '../../../models/report-layer.model';

import {AuthService} from 'src/app/services/auth.service';
import {User} from '../../../models/user.model';


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

    selectedLayer: ReportLayer;
    selectedLayerLabel: string;
    selectedLayerValue: number;

    isLoading = false;

    totalRecords = 0;

    rowsPerPage: any[];
    defaultRowsPerPage = 10;
    selectedRowsPerPage: number = this.defaultRowsPerPage;

    filters: ReportLayer[];
    selectedFilter: ReportLayer;
    selectedFilterValue: number;
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
    loggedUser: User = null;

    constructor(
        private hTTPService: HTTPService,
        private configService: ConfigService,
        private tableService: TableService,
        private filterService: FilterService,
        private mapService: MapService,
        private reportService: ReportService,
        private messageService: MessageService,
        private exportService: ExportService,
        private authService: AuthService
    ) {
    }

    async ngOnInit() {
        this.tableConfig = this.configService.getMapConfig('table');

        this.formats = this.configService.getMapConfig('export').formats;

        this.rowsPerPage = this.tableConfig.rowsPerPage;

        this.authService.user.subscribe((user) => this.loggedUser = user)


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

        this.filters = await this.configService.getReportLayers().then((response: Response) => {
            const data = response.data;
            const reportLayers = [];
            data.forEach((rl) => {
                reportLayers.push(new ReportLayer(
                    rl['cod_group'],
                    rl['count'],
                    rl['count_alias'],
                    rl['is_dynamic'],
                    rl['label'],
                    rl['seq'],
                    rl['sort_field'],
                    rl['sum'],
                    rl['sum_alias'],
                    rl['sum_field'],
                    rl['table_alias'],
                    rl['table_name'],
                    rl['type'],
                    rl['value']
                ));
            });
            return reportLayers;
        });

        this.tableService.loadReportTableData.subscribe(() => {
            this.showBurn = true;
            this.showProdes = true;
            this.showDeter = true;
            this.isLoading = true;
            const selectedOption = this.filters[0];
            this.selectedLayer = selectedOption;
            this.selectedFilter = selectedOption;
            this.selectedFilterValue = selectedOption.value;
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

        const url = this.configService.getAppConfig('layerUrls')[layer.type]['table'];
        const countTotal = true;

        const view = JSON.stringify(
            new View(
                layer.value,
                layer.cod,
                layer.codgroup ? layer.codgroup : layer.codgroup,
                layer.isDynamic ? layer.isDynamic : layer.type === 'analysis',
                layer.isPrimary === undefined ? true : layer.isPrimary,
                layer.tableOwner ? layer.tableOwner : layer.tableOwner,
                layer.tableName ? layer.tableName : layer.tableName
            )
        );

        this.showDeter =
            ((layer.codgroup === 'DETER') ||
                (layer.codgroup === 'CAR'));
        this.showProdes =
            ((layer.codgroup === 'PRODES') ||
                (layer.codgroup === 'CAR'));
        this.showBurn =
            ((layer.codgroup === 'BURNED_AREA') ||
                (layer.codgroup === 'BURNED') ||
                (layer.codgroup === 'CAR'));
        const params = {view, limit, offset, countTotal};

        if (this.selectedFilter) {
            params['count'] = this.selectedFilter.count;
            params['sum'] = !this.showBurn ? this.selectedFilter.sum : false;
            params['isDynamic'] = this.selectedFilter.isDynamic;
            params['tableAlias'] = this.selectedFilter.tableAlias;
            params['sumAlias'] = this.selectedFilter.sumAlias;
            params['countAlias'] = this.selectedFilter.countAlias;
            params['sumField'] = this.selectedFilter.sumField;
        }

        params['sortField'] = sortField ? sortField : this.selectedFilter && this.selectedFilter.sortField ? this.selectedFilter.sortField : undefined;
        params['sortOrder'] = sortOrder ? sortOrder : 1;

        await this.hTTPService
            .get(url, this.filterService.getParams(params))
            .subscribe(async data => await this.setData(data, layer.codgroup ? layer.codgroup : layer.codgroup));
    }

    async setData(data, group) {
        if (data) {
            this.selectedColumns = [];
            this.columns = [];
            this.totalRecords = 0;
            if (Array.isArray(data)) {
                this.totalRecords = data.pop();
            } else {
                data = [];
            }
            if (data.length > 0) {
                if (!this.tableReportActive) {
                    const infoColumns = await this.configService.getInfoColumns().then((response: Response) => response);
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
            if (sortField === column['field']) {
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
        this.loadTableData(selectedOption, this.selectedRowsPerPage, 0, selectedOption.sortField, 1);
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
        this.selectedFilterValue = undefined;
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
            layer.codgroup,
            layer.codgroup !== 'CAR',
            true,
            layer.tableName,
            layer.tableName
        );

        const params = await this.filterService.getParams(view);
        const selectedProperties = this.selectedProperties;

        const selectedGids = [];
        selectedProperties.forEach((selectedProperty) => {
            selectedGids.push(selectedProperty.gid);
        });

        params['fileFormats'] = selectedFormats.toString();
        params['selectedGids'] = selectedGids.toString();

        await this.exportService.export(params, selectedFormats, layer.tableName);

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
        if (this.loggedUser && this.loggedUser.administrator) {
            this.isExportDisabled = false;
        }
    }

    onRowUnselect() {
        if (this.selectedProperties.length === 0 || !this.loggedUser || this.loggedUser.administrator) {
            this.isExportDisabled = true;
        }
    }

    onHeaderCheckboxToggle(event) {
        const checked = event.checked;
        if (checked && this.isExportDisabled && this.loggedUser && this.loggedUser.administrator) {
            this.isExportDisabled = false;
        } else if (!checked) {
            this.isExportDisabled = true;
        }
    }

    getRegister(data) {
        return data['gid'];
    }
}
