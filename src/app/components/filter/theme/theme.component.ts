import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ConfigService } from '../../../services/config.service';

import { FilterTheme } from '../../../models/filter-theme.model';

import { SelectItem } from 'primeng/api';

import { FilterService } from '../../../services/filter.service';

@Component({
	selector: 'app-theme',
	templateUrl: './theme.component.html',
	styleUrls: ['./theme.component.css']
})
export class ThemeComponent implements OnInit {

	@Input() disable;
	@Output() onChangeThemeSelected: EventEmitter<FilterTheme> = new EventEmitter<FilterTheme>();

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
		this.onChangeSelected({ value: this.selectedOption });
		this.filterService.changeTheme.subscribe(theme => {
			this.onChangeOptionField({ value: theme.type });
			this.onChangeSelected(theme);
		});
	}

	onChangeOptionField(option) {
		switch (option.value) {
			case 'city':
				this.optionSelectedByFilter = new FilterTheme(undefined, 'Município', 'city');
				this.loadComboCity();
				break;
			case 'biome':
				this.optionSelectedByFilter = new FilterTheme(undefined, 'Bioma', 'biome');
				this.optionsFilterLocalizations = [];
				this.loadComboBiome();
				break;
			case 'region':
				this.optionSelectedByFilter = new FilterTheme(undefined, 'Comarca', 'region');
				this.loadComboRegion();
				break;
			case 'mesoregion':
				this.optionSelectedByFilter = new FilterTheme(undefined, 'Mesorregião', 'mesoregion');
				this.loadComboMesoregion();
				break;
			case 'immediateregion':
				this.optionSelectedByFilter = new FilterTheme(undefined, 'RGI', 'immediateregion');
				this.loadComboImmediateRegion();
				break;
			case 'intermediateregion':
				this.optionSelectedByFilter = new FilterTheme(undefined, 'RGINT', 'intermediateregion');
				this.loadComboIntermediateRegion();
				break;
			case 'microregion':
				this.optionSelectedByFilter = new FilterTheme(undefined, 'Microrregião', 'microregion');
				this.optionsFilterLocalizations = [];
				this.loadComboMicroregion();
				break;
			case 'pjbh':
				this.optionSelectedByFilter = new FilterTheme(undefined, 'PJBH', 'pjbh');
				this.optionsFilterLocalizations = [];
				this.loadComboPjbh();
				break;
			case 'ti':
				this.optionSelectedByFilter = new FilterTheme(undefined, 'Terra indígena', 'ti');
				this.loadComboTI();
				break;
			case 'uc':
				this.optionSelectedByFilter = new FilterTheme(undefined, 'Unidade de conservação', 'uc');
				this.loadComboUC();
				break;
			case 'projus':
				this.optionSelectedByFilter = new FilterTheme(undefined, 'Projus Bacias', 'projus');
				this.loadComboProjus();
				break;
			default:
				this.clearAll();
		}
	}

	onChangeSelected(event) {
		this.optionSelectedByFilter.value = event.value;
		this.onChangeThemeSelected.emit(this.optionSelectedByFilter);
	}

	public clearAll() {
		this.optionSelectedByFilter = new FilterTheme('ALL');
		this.onChangeThemeSelected.emit(this.optionSelectedByFilter);
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
		this.filterService.getAllConservationUnit().then(result => this.optionsFilterLocalizations = this.addElementAll(result));
	}

	private loadComboTI() {
		this.filterService.getAllIndigenousLand().then(result => this.optionsFilterLocalizations = this.addElementAll(result));
	}

	private loadComboProjus() {
		this.filterService.getAllProjus().then(result => this.optionsFilterLocalizations = this.addElementAll(result));
	}

	private addElementAll(options) {
		const all = { gid: -1, name: 'Todos', value: 'ALL' };
		const result = [all, ...options];

		this.optionSelectedByFilter.value = result[0];
		this.onChangeSelected(this.optionSelectedByFilter);

		return result;
	}
}
