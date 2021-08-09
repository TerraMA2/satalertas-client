import { Component, Input, OnInit } from '@angular/core';

import { LazyLoadEvent, MessageService } from 'primeng/api';

import { HTTPService } from 'src/app/services/http.service';

import { ConfigService } from 'src/app/services/config.service';

import { TableService } from 'src/app/services/table.service';

import { FilterService } from 'src/app/services/filter.service';

import { Layer } from '../../../models/layer.model';

import { MapService } from 'src/app/services/map.service';

import { View } from '../../../models/view.model';

import { ExportService } from '../../../services/export.service';

import { AuthService } from 'src/app/services/auth.service';

import { User } from '../../../models/user.model';

import { environment } from '../../../../environments/environment';
import { InfoColumnsService } from '../../../services/info-columns.service';


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

	@Input() tableHeight;

	selectedProperties;

	selectedLayer: Layer;
	selectedLayerValue: number;

	isLoading = false;

	totalRecords = 0;

	rowsPerPage: any[];
	defaultRowsPerPage = 20;
	selectedRowsPerPage: number = this.defaultRowsPerPage;

	private tableConfig;

	constructor(
		private hTTPService: HTTPService,
		private configService: ConfigService,
		private tableService: TableService,
		private filterService: FilterService,
		private infoColumnsService: InfoColumnsService
	) {
	}

	async ngOnInit() {
		this.tableConfig = this.configService.getMapConfig('table');

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

		const params = { view, limit, offset, countTotal };

		params['sortField'] = sortField ? sortField : undefined;
		params['sortOrder'] = sortOrder ? sortOrder : 1;

		await this.hTTPService
		.get<any>(environment.serverUrl + url, { params: this.filterService.getParams(params) })
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
				const infoColumns = await this.infoColumnsService.getInfoColumns().then((response: Response) => response);
				const changedData = [];
				Object.keys(data[0]).forEach(key => {
					const column = infoColumns && infoColumns[group] ? infoColumns[group][key] : '';
					const show = column ? column.show : false;
					const alias = column ? column.alias : key;
					if (show === true) {
						this.columns.push({ field: alias, header: alias, sortColumn: key });
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
		this.loadTableData(layer.selectedOption, this.selectedRowsPerPage, 0);
	}

	onRowsPerPageChange(event) {
		this.loadTableData(this.selectedLayer, this.selectedRowsPerPage, 0);
	}

	trackById(index, item) {
		return item.field;
	}

	clearTable() {
		this.tableData = undefined;
		this.selectedLayerValue = 0;
		this.selectedColumns = undefined;
		this.selectedRowsPerPage = this.defaultRowsPerPage;
		this.totalRecords = 0;
		this.columns = [];
		this.selectedLayer = null;
		this.selectedLayerValue = null;
		this.isLoading = false;
	}
}
