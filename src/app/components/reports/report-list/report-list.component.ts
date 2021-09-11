import { Component, OnInit } from '@angular/core';

import { LazyLoadEvent, MessageService } from 'primeng/api';

import { HTTPService } from 'src/app/services/http.service';

import { ConfigService } from 'src/app/services/config.service';

import { TableService } from 'src/app/services/table.service';

import { FilterService } from 'src/app/services/filter.service';

import { MapService } from 'src/app/services/map.service';

import { View } from '../../../models/view.model';

import { ReportService } from '../../../services/report.service';

import { Response } from '../../../models/response.model';

import { Util } from '../../../utils/util';

import { ExportService } from '../../../services/export.service';

import { ReportLayer } from '../../../models/report-layer.model';

import { AuthService } from 'src/app/services/auth.service';

import { User } from '../../../models/user.model';

import { environment } from '../../../../environments/environment';

import { TableState } from '../../../models/table-state.model';

import { ActivatedRoute, Router } from '@angular/router';

import { NavigationService } from '../../../services/navigation.service';

@Component({
	selector: 'app-report-list',
	templateUrl: './report-list.component.html',
	styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit {
	tableData: any[] = [];
	columns: any[] = [];
	selectedColumns: any[] = [];
	
	selectedProperties;
	
	isLoading = false;
	
	totalRecords = 0;
	
	rowsPerPage: any[];
	defaultRowsPerPage = 20;
	selectedRowsPerPage: number = this.defaultRowsPerPage;
	
	reportLayers: ReportLayer[];
	selectedLayer: ReportLayer;
	selectedLayerValue: number;
	selectedLayerSortField: string;
	selectedLayerLabel: string;
	
	showBurn = false;
	showDeter = false;
	showProdes = false;
	
	isExportDisabled = true;
	
	reports = [];
	formats;
	selectedFormats: [];
	loggedUser: User = null;
	sortOrder;
	defaultSortOrder = -1;
	sortField: string;
	expandedRowKey = {};
	first;
	private tableConfig;
	private columnOrder: [];
	private excludedColumns: string[];
	
	constructor(
		private hTTPService: HTTPService,
		private configService: ConfigService,
		private tableService: TableService,
		private filterService: FilterService,
		private mapService: MapService,
		private reportService: ReportService,
		private messageService: MessageService,
		private exportService: ExportService,
		private authService: AuthService,
		private router: Router,
		private navigationService: NavigationService,
		private activatedRoute: ActivatedRoute
	) {
	}
	
	async ngOnInit() {
		this.tableConfig = this.configService.getMapConfig('table');
		this.formats = this.configService.getMapConfig('export').formats;
		this.excludedColumns = this.tableConfig.excludedColumns;
		this.rowsPerPage = this.tableConfig.rowsPerPage;
		this.activatedRoute.data.subscribe(data => this.loggedUser = data['user']);
		
		this.reportLayers = await this.tableService.getReportLayers().then((response: Response) => {
			const data = response.data;
			return data.map(reportLayer => new ReportLayer(
				reportLayer['groupCode'],
				reportLayer['count'],
				reportLayer['count_alias'],
				reportLayer['is_dynamic'],
				reportLayer['label'],
				reportLayer['seq'],
				reportLayer['sort_field'],
				reportLayer['sum'],
				reportLayer['sum_alias'],
				reportLayer['sum_field'],
				reportLayer['table_alias'],
				reportLayer['table_name'],
				reportLayer['type'],
				reportLayer['value']
			));
		});
		
		this.showBurn = true;
		this.showProdes = true;
		this.showDeter = true;
		this.isLoading = true;
		const selectedOption = this.reportLayers[0];
		this.selectedLayer = selectedOption;
		this.selectedLayerValue = selectedOption.value;
		this.selectedLayerSortField = selectedOption.sortField;
		if (localStorage.getItem('tableState')) {
			await this.restoreState();
		} else {
			this.first = 0;
			await this.loadTableData(selectedOption, this.selectedRowsPerPage, 0, this.selectedLayerSortField, 1);
			await this.saveState();
		}
		
		this.tableService.clearTable.subscribe(() => this.clearTable());
		
		this.filterService.filterTable.subscribe(() => this.tableService.loadTableData.next(this.selectedLayer));
		
		this.tableService.loadTableData.subscribe(layer => {
			if (layer) {
				this.isLoading = true;
				this.loadTableData(layer, this.selectedRowsPerPage, 0);
			}
		});
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
				layer.code,
				layer.groupCode ? layer.groupCode : layer.groupCode,
				layer.isDynamic ? layer.isDynamic : layer.type === 'analysis',
				layer.isPrimary === undefined ? true : layer.isPrimary,
				layer.tableOwner ? layer.tableOwner : layer.tableOwner,
				layer.tableName ? layer.tableName : layer.tableName
			)
		);
		
		this.showDeter =
			((layer.groupCode === 'DETER') ||
				(layer.groupCode === 'CAR'));
		this.showProdes =
			((layer.groupCode === 'PRODES') ||
				(layer.groupCode === 'CAR'));
		this.showBurn =
			((layer.groupCode === 'BURNED_AREA') ||
				(layer.groupCode === 'BURNED') ||
				(layer.groupCode === 'CAR'));
		const params = { view, limit, offset, countTotal };
		
		if (this.selectedLayer) {
			params['count'] = this.selectedLayer.count;
			params['sum'] = !this.showBurn ? this.selectedLayer.sum : false;
			params['isDynamic'] = this.selectedLayer.isDynamic;
			params['tableAlias'] = this.selectedLayer.tableAlias;
			params['sumAlias'] = this.selectedLayer.sumAlias;
			params['countAlias'] = this.selectedLayer.countAlias;
			params['sumField'] = this.selectedLayer.sumField;
		}
		params['sortField'] = sortField ? sortField : this.selectedLayer && this.selectedLayer.sortField ? this.selectedLayer.sortField : undefined;
		params['sortOrder'] = sortOrder ? sortOrder : 1;

		this.hTTPService
		.get(environment.serverUrl + url, { params: this.filterService.getParams(params) })
		.toPromise().then(async (response: Response) => {
			const data = response.data;
				await this.setData(data);
		});
	}

	filterColumns(key) {
		return !this.excludedColumns.includes(key);
	}

	async setData(data) {
		if (!data) {
			this.tableData = [];
		}
		this.selectedColumns = [];
		this.columns = [];
		this.totalRecords = 0;
		if (Array.isArray(data)) {
			this.totalRecords = data.pop();
		} else {
			data = [];
		}
		if (data.length > 0) {
			this.columns = Object.keys(data[0])
			.filter(key => this.filterColumns(key))
			.map(key => {
				return {
					field: key,
					header: key,
					sortColumn: key
				};
			});
		}
		this.selectedColumns = this.columns;
		if (this.columnOrder && this.columnOrder.length > 0) {
			this.selectedColumns = this.columnOrder;
		}

		this.tableData = data;

		this.rowsPerPage = this.rowsPerPage.filter((row) => row.value !== this.totalRecords);

		if (this.totalRecords > 1000) {
			this.rowsPerPage.push({
				label: this.totalRecords,
				value: this.totalRecords
			});
		}
		this.isLoading = false;
	}
	
	getSortField(sortField) {
		if (!sortField) {
			return '';
		}
		const column = this.selectedColumns.find(selectedColumn => sortField === selectedColumn['field']);
		return column['sortColumn'];
	}
	
	async onRowsPerPageChange(event) {
		await this.loadTableData(this.selectedLayer, this.selectedRowsPerPage, 0);
		this.saveState();
	}
	
	onRowExpand(event) {
		const gid = event.data.gid;
		this.expandedRowKey = { [gid]: true };
		this.reportService.getReportsByCARCod(gid).then((response: Response) => this.reports = (response.status === 200) ? response.data : []);
		this.saveState();
	}
	
	onLazyLoad(event: LazyLoadEvent) {
		this.loadTableData(this.selectedLayer,
			this.selectedRowsPerPage ? this.selectedRowsPerPage : event.rows,
			this.first || this.first === 0 ? this.first : event.first,
			this.sortField ? this.sortField : this.getSortField(event.sortField),
			this.sortOrder ? this.sortOrder : event.sortOrder
		);
	}
	
	onSort(event) {
		this.sortField = event.field;
		this.sortOrder = event.order;
		this.saveState();
	}
	
	onPage(event) {
		this.first = event.first;
		this.saveState();
	}
	
	onRowCollapse(event) {
		const gid = event.data.gid;
		this.expandedRowKey = { [gid]: false };
		this.saveState();
	}
	
	onLayerChange(event) {
		const selectedOption = event.selectedOption;
		this.selectedLayer = selectedOption;
		this.selectedLayerValue = selectedOption.value;
		this.selectedLayerLabel = selectedOption.label;
		this.columnOrder = [];
		this.loadTableData(selectedOption, this.selectedRowsPerPage, 0, selectedOption.sortField, 1);
		this.saveState();
	}
	
	onColumnsChanged(event) {
		this.columnOrder = event.value;
		this.saveState();
	}
	
	trackById(index, item) {
		return item.field;
	}
	
	clearTable() {
		this.tableData = undefined;
		this.selectedLayerValue = undefined;
		this.selectedColumns = undefined;
		this.selectedRowsPerPage = this.defaultRowsPerPage;
		this.totalRecords = 0;
		this.columns = [];
		this.selectedLayer = null;
		this.selectedLayerSortField = null;
		this.showBurn = false;
		this.showProdes = false;
		this.showDeter = false;
		this.isLoading = false;
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
		
		const layer = this.selectedLayer;
		
		const view = new View(
			layer.value,
			layer.label.toUpperCase().replace(' ', '_'),
			layer.groupCode,
			layer.groupCode !== 'CAR',
			true,
			layer.tableName,
			layer.tableName
		);
		
		const params = this.filterService.getParams(view);
		const selectedProperties = this.selectedProperties;
		
		const selectedGids = selectedProperties.map(selectedProperty => selectedProperty.gid);
		
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
	
	saveState() {
		const tableState: TableState = {
			selectedLayer: this.selectedLayer,
			first: this.first,
			rows: this.selectedRowsPerPage,
			sortField: this.sortField,
			sortOrder: this.sortOrder,
			columnOrder: this.columnOrder,
			expandedRowKey: this.expandedRowKey
		};
		localStorage.setItem('tableState', JSON.stringify(tableState));
	}
	
	restoreState() {
		const tableState: TableState = JSON.parse(localStorage.getItem('tableState'));
		this.selectedRowsPerPage = tableState.rows;
		this.sortField = tableState.sortField;
		this.sortOrder = tableState.sortOrder;
		this.columnOrder = tableState.columnOrder;
		this.expandedRowKey = tableState.expandedRowKey;
		this.selectedLayer = tableState.selectedLayer;
		this.selectedLayerValue = this.selectedLayer.value;
		this.first = tableState.first;
		if (this.selectedLayer) {
			this.loadTableData(this.selectedLayer, this.selectedRowsPerPage, 0, this.selectedLayer.sortField, 1);
		}
	}
	
}
