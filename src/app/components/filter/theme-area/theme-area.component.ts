import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfigService} from '../../../services/config.service';
import {FilterTheme} from '../../../models/filter-theme.model';
import {BiomeService} from '../../../services/biome.service';
import {CityService} from '../../../services/city.service';
import {RegionService} from '../../../services/region.service';
import {SelectItem} from 'primeng/api';

@Component({
  selector: 'app-theme-area',
  templateUrl: './theme-area.component.html',
  styleUrls: ['./theme-area.component.css']
})
export class ThemeAreaComponent implements OnInit, AfterViewInit {

  @Input() disable;
  @Output() onchangeOptionSelected: EventEmitter<FilterTheme> = new EventEmitter<FilterTheme>();

  optionSelectedByFilter: FilterTheme;

  options: SelectItem[];

  optionField;

  selectedOption: string;

  optionsFilterLocalizations;

  constructor(
    private configService: ConfigService,
    private biomeService: BiomeService,
    private cityService: CityService,
    private regionService: RegionService
  ) { }

  ngOnInit() {
    this.optionSelectedByFilter = new FilterTheme(undefined, undefined, undefined );
    this.optionField = this.configService.getMapConfig('filter').optionField;
    this.options = this.optionField.options;
  }

  ngAfterViewInit() {
  }

  onChangeOptionField(option) {

    if (option.value === 'city') {
      this.optionSelectedByFilter = new FilterTheme('Município', undefined, 'city' );

      this.loadComboCity();
    } else if (option.value  === 'biome') {
      this.optionSelectedByFilter = new FilterTheme('Bioma', undefined, 'biome' );
      this.optionsFilterLocalizations = [];

      this.loadComboBiome();
    } else if (option.value  === 'region') {
      this.optionSelectedByFilter = new FilterTheme('Comarca', undefined, 'region' );

      this.loadComboRegion();
    } else { this.clearValuesFilter(); }
  }

  onchangeSelected(event) {
    const selected = event.value ? this.optionSelectedByFilter : undefined;

    this.onchangeOptionSelected.emit(selected);
  }

  public clearAll() {
    this.selectedOption = undefined;
    this.optionSelectedByFilter = undefined;
    this.onchangeOptionSelected.emit(this.optionSelectedByFilter);
  }

  clearValuesFilter() { this.optionSelectedByFilter = new FilterTheme(undefined, undefined, undefined ); }

  private loadComboCity() { this.cityService.getAll().then( result => this.optionsFilterLocalizations = result ); }

  private loadComboBiome() { this.biomeService.getAll().then( result => this.optionsFilterLocalizations = result ); }

  private loadComboRegion() { this.regionService.getAll().then( result => this.optionsFilterLocalizations = result ); }
}
