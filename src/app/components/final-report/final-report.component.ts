import { Component, OnInit } from '@angular/core';

import { Report } from 'src/app/models/report.model';

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

  report: Report;

  carRegister: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private hTTPService: HTTPService,
    private configService: ConfigService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => this.carRegister = params.carRegister);
    this.reportConfig = this.configService.getReportConfig();
    this.getReportData();
  }

  getReportData() {
    const date = JSON.parse(localStorage.getItem('dateFilter'));
    const propertyConfig = this.reportConfig.propertyData;
    const url = propertyConfig.url;
    const viewId = propertyConfig.viewId;
    this.carRegister = this.carRegister.replace('\\', '/');
    const carRegister = this.carRegister;
    this.hTTPService.get(url, {viewId, carRegister, date}).subscribe((reportData: Property) => {
        this.report = new Report('Relatório',
                                reportData.city,
                                'Promotoria de Justiça de Sinop',
                                '00001',
                                reportData.name,
                                '000.000.000-00',
                                this.carRegister,
                                reportData['prodesArea'],
                                date
        );
    });
  }

}
