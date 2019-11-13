import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { HTTPService } from 'src/app/services/http.service';

import { ConfigService } from 'src/app/services/config.service';

import { Property } from 'src/app/models/property.model';

@Component({
  selector: 'app-final-report',
  templateUrl: './final-report.component.html',
  styleUrls: ['./final-report.component.css']
})
export class FinalReportComponent implements OnInit {

  private reportConfig;

  property: Property;

  carRegister: string;

  dateFilter: string;

  formattedFilterDate: string;

  currentYear: number;
  prodesStartYear: string;

  tableColumns;

  tableData;

  constructor(
    private activatedRoute: ActivatedRoute,
    private hTTPService: HTTPService,
    private configService: ConfigService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => this.carRegister = params.carRegister);
    this.reportConfig = this.configService.getReportConfig();

    this.tableColumns = [
      { field: 'affectedArea', header: 'Área atingida' },
      { field: 'recentDeforestation', header: 'Desmatamento recente (DETER – nº de alertas)' },
      { field: 'pastDeforestation', header: 'Desmatamento pretérito (PRODES – ha ano-1)' }
    ];

    this.tableData = [
      { affectedArea: 'APP', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'ARL', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'AUR', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'UC - PI', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'UC - US', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'TI', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'AUC', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'AUAS', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'AUTEX', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'AD', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'Área autuada', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'Área embargada', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'Área desembargada', recentDeforestation: '', pastDeforestation: '' }
    ];

    this.getReportData();
  }

  getReportData() {
    const date = JSON.parse(localStorage.getItem('dateFilter'));
    const startDate = new Date(date[0]).toLocaleDateString('pt-BR');
    const endDate = new Date(date[1]).toLocaleDateString('pt-BR');

    this.currentYear = new Date().getFullYear();

    this.formattedFilterDate = `${startDate} - ${endDate}`;

    this.dateFilter = `${date[0]}/${date[1]}`;
    const propertyConfig = this.reportConfig.propertyData;
    const url = propertyConfig.url;
    const viewId = propertyConfig.viewId;
    this.carRegister = this.carRegister.replace('\\', '/');
    const carRegister = this.carRegister;
    this.hTTPService.get(url, {viewId, carRegister, date}).subscribe((reportData: Property) => {
      this.prodesStartYear = reportData.prodesYear[0]['date'];

      const bboxArray = reportData.bbox.split(',');
      const bbox = bboxArray[0].split(' ').join(',') + ',' + bboxArray[1].split(' ').join(',');

      reportData.bbox = bbox;
      this.property = reportData;

    });
  }

}
