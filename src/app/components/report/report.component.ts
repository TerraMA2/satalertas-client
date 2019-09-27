import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { HTTPService } from 'src/app/services/http.service';

import { Property } from 'src/app/models/property.model';

import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  carRegister: string;

  property: Property;

  private propertyConfig;

  constructor(
    private activatedRoute: ActivatedRoute,
    private hTTPService: HTTPService,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => this.carRegister = params.carRegister);
    this.configService.get().subscribe(propertyConfig => this.propertyConfig = propertyConfig);
    const url = this.propertyConfig.url;
    const viewId = this.propertyConfig.viewId;
    const carRegister = this.carRegister;
    this.hTTPService.get(url, {viewId, carRegister}).subscribe(propertyData => {
      this.property = new Property(propertyData['register'],
                                  propertyData['area'],
                                  propertyData['name'],
                                  propertyData['city'],
                                  propertyData['bbox']);
    });
  }

}
