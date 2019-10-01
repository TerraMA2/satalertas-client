import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { SelectItem } from 'primeng/api';

import { ConfigService } from 'src/app/services/config.service';

import { NgForm } from '@angular/forms';

import { HTTPService } from 'src/app/services/http.service';

import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input() displayFilter = false;

  @ViewChild('filterForm', { static: false }) filterForm: NgForm;

  private filterConfig;

  dateInput: Date;
  areaInput;

  dateField;
  areaField;
  groupsField;
  localizationField;

  localizations: SelectItem[];
  selectedLocalization;
  selectedGroup;

  groups: SelectItem[];

  constructor(
    private configService: ConfigService,
    private hTTPService: HTTPService,
    private mapService: MapService
  ) { }

  ngOnInit() {
    this.filterConfig = this.configService.getConfig('map').filter;
    this.groupsField = this.filterConfig.group;
    this.groups = this.groupsField.options;
    this.localizationField = this.filterConfig.localization;
    this.localizations = this.localizationField.options;
    this.areaField = this.filterConfig.area;
    this.dateField = this.filterConfig.date;
  }

   onFilterClicked() {
    this.hTTPService.get(this.filterConfig.url, this.filterForm.form.value).subscribe(data => {
        this.mapService.getFilteredData.next(data);
    });
   }

   onClearFilterClicked() {
    this.selectedGroup = '';
    this.selectedLocalization = '';
    this.dateInput = null;
    this.areaInput = '';
   }

   onDialogHide() {
     this.displayFilter = false;
   }

}
