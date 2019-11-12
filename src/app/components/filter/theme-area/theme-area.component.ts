import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfigService} from '../../../services/config.service';
import {FilterTheme} from '../../../models/filter-theme.model';
import {BiomeService} from '../../../services/biome.service';
import {CityService} from '../../../services/city.service';
import {ConsolidatedUseAreaService} from '../../../services/consolidated-use-area.service';
import {SelectItem} from 'primeng/api';
import {IndigenousLand} from '../../../services/indigenous-land.service';

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
    private consolidatedUseAreaService: ConsolidatedUseAreaService,
    private indigenousLand: IndigenousLand
  ) { }

  ngOnInit() {
    this.optionSelectedByFilter = new FilterTheme(undefined, undefined, undefined );
    this.optionField = this.configService.getMapConfig('filter').optionField;
    this.options = this.optionField.options;
    this.selectedOption = 'all';
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
    } else if (option.value === 'mesoregion') {
      this.optionSelectedByFilter = new FilterTheme('Mesoregião', undefined, 'mesoregion' );

      this.loadComboMesoregion();
    } else if (option.value  === 'microregion') {
      this.optionSelectedByFilter = new FilterTheme('Microregião', undefined, 'microregion' );
      this.optionsFilterLocalizations = [];

      this.loadComboMicroregion();
    } else if (option.value  === 'ti') {
      this.optionSelectedByFilter = new FilterTheme('Terra indígena', undefined, 'ti' );

      this.loadComboTI();
    }  else if (option.value  === 'uc') {
      this.optionSelectedByFilter = new FilterTheme('Unidade de conservação', undefined, 'uc' );

      this.loadComboUC();
    }  else { this.clearValuesFilter(); }
  }

  onchangeSelected(event) {
    const selected = event.value ? this.optionSelectedByFilter : undefined;

    this.onchangeOptionSelected.emit(selected);
  }

  public clearAll() {
    this.optionSelectedByFilter = undefined;
    this.onchangeOptionSelected.emit(this.optionSelectedByFilter);
    this.selectedOption = 'all';
  }

  clearValuesFilter() { this.optionSelectedByFilter = new FilterTheme(undefined, undefined, undefined ); }

  private loadComboCity() { this.cityService.getAll().then( result => this.optionsFilterLocalizations = result ); }

  private loadComboBiome() { this.biomeService.getAll().then( result => this.optionsFilterLocalizations = result ); }

  private loadComboRegion() { this.cityService.getAllRegions().then( result => this.optionsFilterLocalizations = result ); }

  private loadComboMesoregion() { this.cityService.getAllMesoregions().then( result => this.optionsFilterLocalizations = result ); }

  private loadComboMicroregion() { this.cityService.getAllMicroregions().then( result => this.optionsFilterLocalizations = result ); }

  private loadComboUC() { this.consolidatedUseAreaService.getAll().then( result => this.optionsFilterLocalizations = result ); }

  private loadComboTI() { this.indigenousLand.getAll().then( result => this.optionsFilterLocalizations = result ); }
}
