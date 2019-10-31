import {Component, OnInit, Input, ViewChild, AfterViewInit} from '@angular/core';

import { SelectItem } from 'primeng/api';

import { ConfigService } from 'src/app/services/config.service';

import { NgForm } from '@angular/forms';

import { HTTPService } from 'src/app/services/http.service';

import { MapService } from 'src/app/services/map.service';

import {FilterService} from '../../services/filter.service';

import {Layer} from '../../models/layer.model';

import {Filter} from '../../models/filter.model';

import {Localization} from '../../models/localization.model';

import {BiomeService} from '../../services/biome.service';

import {CityService} from '../../services/city.service';
import {RegionService} from '../../services/region.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})

export class FilterComponent implements OnInit, AfterViewInit {

  @ViewChild('filterForm', { static: false }) filterForm: NgForm;

  private filterConfig;
  public displayFilter: boolean;
  private codgroup: string;
  private layer: Layer;
  private selectedFilters: Filter[] = [];

  areaInput: string;

  areaField;
  groupsField;
  localizationField;

  localizations: SelectItem[];
  selectedLocalization: string;
  selectedGroup;

  groups: SelectItem[];
  filterLabel: string;

  localization: Localization;

  optionsFilterLocalizations;

  constructor(
    private configService: ConfigService,
    private hTTPService: HTTPService,
    private mapService: MapService,
    private filterService: FilterService,
    private biomeService: BiomeService,
    private cityService: CityService,
    private regionService: RegionService
  ) { }

  ngOnInit() {
    this.filterConfig = this.configService.getConfig('map').filter;
    this.displayFilter = false;
    this.areaField = this.filterConfig.area;
    this.groupsField = this.filterConfig.group;
    this.localizationField = this.filterConfig.localization;
    this.localizations = this.localizationField.options;
    this.groups = this.groupsField.options;

    this.localization = new Localization(undefined, undefined, undefined);
  }

  loadComboCity() {
    this.cityService.getAll().then(
      result => {
        this.optionsFilterLocalizations = result;
      }
    );
  }

  loadComboBiome() {
    this.biomeService.getAll().then( result => this.optionsFilterLocalizations = result );
  }

  loadComboRegion() {
    this.regionService.getAll().then(
      result => {
        this.optionsFilterLocalizations = result;
      }
    );
  }

  ngAfterViewInit() {
    this.setOverlayEvents();
  }

  setOverlayEvents() {
    this.filterService.displayFilter.subscribe(layer => { this.onDisplayFilter(layer); });
  }

  onDisplayFilter(layer: unknown) {
    this.displayFilter = !this.displayFilter;

    this.filterLabel = 'Filtro';
    this.codgroup = undefined;
    this.layer = null;
  }

  onFilterClicked() {
    this.updateFilter(this.layer);
    this.filterService.filterLayerMap.next(this.layer);
  }

  onClearFilterClicked() {
    this.selectedGroup = undefined;
    this.selectedLocalization = undefined;
    this.areaInput = undefined;

    this.clearValuesFilter();
  }

  onDialogHide() {
    this.onClearFilterClicked();
    this.displayFilter = false;
  }

  updateFilter(layer) {
    this.updateFilterSelected(new Filter(layer.codgroup, this.areaInput, this.selectedLocalization));
  }

  updateFilterSelected(filter) {
    if (this.selectedFilters && this.selectedFilters.length > 0) {
      this.selectedFilters.forEach((item: Filter, index) => {
        if (item.codgroup === filter.codgroup) {
          this.selectedFilters.splice(index, 1);
        }
      });
    }

    if (filter.area || filter.localization) {
      this.selectedFilters.push(filter);
    }

    localStorage.removeItem('filterList');
    localStorage.setItem('filterList', JSON.stringify(this.selectedFilters));
  }

  onChangeLocalizationField($event: any) {

    if (this.selectedLocalization === 'city') {
      this.localization.label = 'Município';
      this.localization.name = 'city';
      this.localization.value = undefined;

      this.loadComboCity();
    } else if (this.selectedLocalization === 'biome') {
      this.localization.label = 'Bioma';
      this.localization.name = 'biome';
      this.localization.value = undefined;

      this.loadComboBiome();
    } else if (this.selectedLocalization === 'region') {
      this.localization.label = 'Comarca';
      this.localization.name = 'region';
      this.localization.value = undefined;
      this.loadComboRegion();
    } else {
      this.clearValuesFilter();
    }
  }

  clearValuesFilter() {
    this.localization.label = undefined;
    this.localization.name = undefined;
    this.localization.value = undefined;
  }
}
