import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfigService} from '../../../services/config.service';
import {FilterTheme} from '../../../models/filter-theme.model';
import {BiomeService} from '../../../services/biome.service';
import {CityService} from '../../../services/city.service';
import {ConservationUnitService} from '../../../services/conservation-unit.service';
import {SelectItem} from 'primeng-lts/api';
import {IndigenousLandService} from '../../../services/indigenous-land.service';
import {ProjusService} from '../../../services/projus.service';

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
        private conservationUnitService: ConservationUnitService,
        private indigenousLandService: IndigenousLandService,
        private projusService: ProjusService
    ) {
    }

    ngOnInit() {
        this.optionSelectedByFilter = new FilterTheme('ALL', undefined, undefined);
        this.optionField = this.configService.getMapConfig('filter').optionField;
        this.options = this.optionField.options;
        this.selectedOption = 'ALL';
        this.onchangeSelected({value: this.selectedOption});
    }

    ngAfterViewInit() {
    }

    onChangeOptionField(option) {

        if (option.value === 'city') {
            this.optionSelectedByFilter = new FilterTheme(undefined, 'Município', 'city');

            this.loadComboCity();
        } else if (option.value === 'biome') {
            this.optionSelectedByFilter = new FilterTheme(undefined, 'Bioma', 'biome');
            this.optionsFilterLocalizations = [];

            this.loadComboBiome();
        } else if (option.value === 'region') {
            this.optionSelectedByFilter = new FilterTheme(undefined, 'Comarca', 'region');

            this.loadComboRegion();
        } else if (option.value === 'mesoregion') {
            this.optionSelectedByFilter = new FilterTheme(undefined, 'Mesorregião', 'mesoregion');

            this.loadComboMesoregion();
        } else if (option.value === 'immediateregion') {
            this.optionSelectedByFilter = new FilterTheme(undefined, 'RGI', 'immediateregion');

            this.loadComboImmediateRegion();
        } else if (option.value === 'intermediateregion') {
            this.optionSelectedByFilter = new FilterTheme(undefined, 'RGINT', 'intermediateregion');

            this.loadComboIntermediateRegion();
        } else if (option.value === 'microregion') {
            this.optionSelectedByFilter = new FilterTheme(undefined, 'Microrregião', 'microregion');
            this.optionsFilterLocalizations = [];

            this.loadComboMicroregion();
        } else if (option.value === 'pjbh') {
            this.optionSelectedByFilter = new FilterTheme(undefined, 'PJBH', 'pjbh');
            this.optionsFilterLocalizations = [];

            this.loadComboPjbh();
        } else if (option.value === 'ti') {
            this.optionSelectedByFilter = new FilterTheme(undefined, 'Terra indígena', 'ti');

            this.loadComboTI();
        } else if (option.value === 'uc') {
            this.optionSelectedByFilter = new FilterTheme(undefined, 'Unidade de conservação', 'uc');

            this.loadComboUC();
        } else if (option.value === 'projus') {
            this.optionSelectedByFilter = new FilterTheme(undefined, 'Projus Bacias', 'projus');

            this.loadComboProjus();
        } else {
            this.clearAll();
        }
    }

    onchangeSelected(event) {
        this.optionSelectedByFilter.value = event.value;
        this.onchangeOptionSelected.emit(this.optionSelectedByFilter);
    }

    public clearAll() {
        this.optionSelectedByFilter = new FilterTheme('ALL');
        this.onchangeOptionSelected.emit(this.optionSelectedByFilter);
        this.selectedOption = 'ALL';
    }

    private loadComboCity() {
        this.cityService.getAllSimplified().then(result => this.optionsFilterLocalizations = result);
    }

    private loadComboBiome() {
        this.biomeService.getAllSimplified().then(result => this.optionsFilterLocalizations = result);
    }

    private loadComboRegion() {
        this.cityService.getAllSimplifiedRegions().then(result => this.optionsFilterLocalizations = result);
    }

    private loadComboMesoregion() {
        this.cityService.getAllSimplifiedMesoregions().then(result => this.optionsFilterLocalizations = result);
    }

    private loadComboImmediateRegion() {
        this.cityService.getAllSimplifiedImmediateRegion().then(result => this.optionsFilterLocalizations = result);
    }

    private loadComboIntermediateRegion() {
        this.cityService.getAllSimplifiedIntermediateRegion().then(result => this.optionsFilterLocalizations = result);
    }

    private loadComboPjbh() {
        this.cityService.getAllSimplifiedPjbh().then(result => this.optionsFilterLocalizations = result);
    }

    private loadComboMicroregion() {
        this.cityService.getAllSimplifiedMicroregions().then(result => this.optionsFilterLocalizations = result);
    }

    private loadComboUC() {
        this.conservationUnitService.getAllSimplified().then(result => this.optionsFilterLocalizations = this.addElementeAll(result));
    }

    private loadComboTI() {
        this.indigenousLandService.getAllSimplified().then(result => this.optionsFilterLocalizations = this.addElementeAll(result));
    }

    private loadComboProjus() {
        this.projusService.getAllSimplified().then(result => this.optionsFilterLocalizations = this.addElementeAll(result));
    }

    private addElementeAll(options) {
        const result = [];
        result.push({gid: -1, name: 'Todos', value: 'ALL'});

        if (options && options.length > 0) {
            options.forEach(option => {
                result.push(option);
            });
        }

        this.optionSelectedByFilter.value = result[0];
        this.onchangeSelected(this.optionSelectedByFilter);

        return result;
    }
}
