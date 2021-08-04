import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { FilterTheme } from '../../../models/filter-theme.model';
import { SelectItem } from 'primeng/api';
import { FilterService } from '../../../services/filter.service';

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
		private filterService: FilterService
	) {
	}

	ngOnInit() {
		this.optionSelectedByFilter = new FilterTheme('ALL', undefined, undefined);
		this.optionField = this.configService.getFilterConfig('optionField');
		this.options = this.optionField.options;
		this.selectedOption = 'ALL';
		this.onchangeSelected({ value: this.selectedOption });
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
		this.filterService.getAllCities().then(result => this.optionsFilterLocalizations = result);
	}

	private loadComboBiome() {
		this.filterService.getAllBiomes().then(result => this.optionsFilterLocalizations = result);
	}

	private loadComboRegion() {
		this.filterService.getAllRegions().then(result => this.optionsFilterLocalizations = result);
	}

	private loadComboMesoregion() {
		this.filterService.getAllMesoregions().then(result => this.optionsFilterLocalizations = result);
	}

	private loadComboImmediateRegion() {
		this.filterService.getAllImmediateRegion().then(result => this.optionsFilterLocalizations = result);
	}

	private loadComboIntermediateRegion() {
		this.filterService.getAllIntermediateRegion().then(result => this.optionsFilterLocalizations = result);
	}

	private loadComboPjbh() {
		this.filterService.getAllPjbh().then(result => this.optionsFilterLocalizations = result);
	}

	private loadComboMicroregion() {
		this.filterService.getAllMicroregions().then(result => this.optionsFilterLocalizations = result);
	}

	private loadComboUC() {
		this.filterService.getAllConservationUnit().then(result => {
			this.optionsFilterLocalizations = this.addElementAll(result);
		});
	}

	private loadComboTI() {
		this.filterService.getAllIndigenousLand().then(result => this.optionsFilterLocalizations = this.addElementAll(result));
	}

	private loadComboProjus() {
		this.filterService.getAllProjus().then(result => this.optionsFilterLocalizations = this.addElementAll(result));
	}

	private addElementAll(options) {
		const result = [];
		result.push({ gid: -1, name: 'Todos', value: 'ALL' });

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
