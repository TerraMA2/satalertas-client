import {Component, OnInit, Input, ViewChild, AfterViewInit} from '@angular/core';

import { SelectItem } from 'primeng/api';

import { ConfigService } from 'src/app/services/config.service';

import { NgForm } from '@angular/forms';

import { HTTPService } from 'src/app/services/http.service';

import { MapService } from 'src/app/services/map.service';

import {FilterService} from '../../services/filter.service';
import {Layer} from '../../models/layer.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})

export class FilterComponent implements OnInit, AfterViewInit {

  @ViewChild('filterForm', { static: false }) filterForm: NgForm;

  private filterConfig;
  private displayFilter: boolean;
  private codGroup: string;
  private layer: Layer;
  private selectedFilters: [];

  dateInput: Date;
  areaInput;

  areaField;
  groupsField;
  localizationField;

  localizations: SelectItem[];
  selectedLocalization;
  selectedGroup;

  groups: SelectItem[];
  filterLabel: string;

  constructor(
    private configService: ConfigService,
    private hTTPService: HTTPService,
    private mapService: MapService,
    private filterService: FilterService
  ) { }

  ngOnInit() {
    this.filterConfig = this.configService.getConfig('map').filter;
    this.displayFilter = false;
    this.areaField = this.filterConfig.area;
    this.groupsField = this.filterConfig.group;
    this.localizationField = this.filterConfig.localization;
    this.localizations = this.localizationField.options;
    this.groups = this.groupsField.options;
  }

  ngAfterViewInit() {
    this.setOverlayEvents();
  }

  setOverlayEvents() {
    this.filterService.displayFilter.subscribe(layer => { this.onDisplayFilter(layer); });
  }


  onDisplayFilter(layer) {
    this.displayFilter = this.codGroup !== layer.codGroup;

    this.filterLabel = 'Filtro - ' + layer.label;
    this.codGroup = this.displayFilter ? layer.codGroup : '';
    this.layer = this.displayFilter ? layer : null;
  }

  onFilterClicked() {
    this.updateFilter(this.layer);
    this.filterService.filterLayerMap.next(this.layer);
    this.filterService.filterLayerMap.next(this.layer);
  }

  onClearFilterClicked() {
    this.selectedGroup = '';
    this.selectedLocalization = '';
    this.areaInput = '';
  }

  onDialogHide() {
    this.onClearFilterClicked();
    this.displayFilter = false;
  }

  updateFilter(layer) {
    const filter = {
      codGroup: layer.codGroup,
      area: this.areaInput,
      localization: this.selectedLocalization
    };

    this.updateFilterSelected(filter);
  }

  updateFilterSelected(filter) {
    if (this.selectedFilters && this.selectedFilters.length > 0) {
      this.selectedFilters.forEach((filter_, index) => {
        if (filter_.codGroup === filter.codGroup) {
          this.selectedFilters.splice(index, 1);
        }
      });
    }

    this.selectedFilters.push(filter);

    localStorage.removeItem('dataFilter');
    localStorage.setItem('dataFilter', this.selectedFilters.toString());
  }
}
