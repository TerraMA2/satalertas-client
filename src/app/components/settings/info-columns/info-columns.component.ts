import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { InfoColumnsService } from 'src/app/services/info-columns.service';
import { Response } from '../../../models/response.model';

@Component({
  selector: 'app-info-columns',
  templateUrl: './info-columns.component.html',
  styleUrls: ['./info-columns.component.css']
})
export class InfoColumnsComponent implements OnInit {

  cols: any[];
  tableFields: any[];
  fieldsToFilter: any[];
  tables: any[];
  selectedTable: any;
  clonedColumn = {};
  showModal = false;
  rowInputs = [];
  columnTypes = [];
  sendEditions = false;
  editions = [];

  constructor(
    private infoColumnsService: InfoColumnsService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.infoColumnsService.getTableNames().then(data => {
      this.tables = data;
    })
    this.infoColumnsService.getTypesOptions().then(data => {
      this.columnTypes = data;
    })
    this.infoColumnsService.getAllTest().then(response => {
      this.cols = response.data.tableInfocolumns.filter(({ hide }) => !hide);
    })
  }

  clear(table: any) {
    table.clear()
  }
  onChangeOptionField(event) {
    if (event.value) {
      const { value: { name, id } } = event;
      this.infoColumnsService.getTableColumns(id)
        .then((response: Response) => {
          this.cols = response.data.columns.filter(({ hide }) => !hide);
          this.fieldsToFilter = this.cols.map(({ columnName }) => columnName)
          this.tableFields = response.data.data
        })
    } else {
      this.tableFields = [];
    }
  }
  onRowEditInit(columnData) {
    this.clonedColumn[columnData['id']] = { ...columnData };
  }
  onRowEditSave(column) {
    this.editions.push(column)
    this.sendEditions = true;
  }
  onRowEditCancel(column, index: number) {
    const columnPosition = this.tableFields.findIndex(col => col.id === column.id)
    if (columnPosition >= 0) {
      this.tableFields[columnPosition] = this.clonedColumn[column.id];
      delete this.clonedColumn[column.id]
      this.editions = this.editions.filter(edition => edition.id !== column.id)
      if (this.editions.length === 0) {
        this.sendEditions = false;
      }
    }
  }

  saveEditions() {
    this.infoColumnsService.sendInfocolumnsEditions(this.editions).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: '',
        detail: 'Produto atualizado'
      });
      this.sendEditions = false;
      this.clonedColumn = {};
      this.editions = [];
    })
  }
}
