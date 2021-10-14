import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilterService } from '../../../services/filter.service';
import { ConfigService } from '../../../services/config.service';

@Component({
	selector: 'app-filter-theme',
	templateUrl: './new-filter-theme.component.html',
	styleUrls: ['./new-filter-theme.component.css']
})
export class NewFilterThemeComponent implements OnInit {
	@Input() formGroup: FormGroup;
	label: string;
	themeValues = [];
	themeOptions;

	constructor(
		private filterService: FilterService,
		private configService: ConfigService
	) {
	}

	ngOnInit(): void {
		const filterThemeConfig = this.configService.getNewFilterConfig('theme');
		this.label = filterThemeConfig.label;
		this.themeOptions = filterThemeConfig.options;
	}

	async onThemeOptionChange(event) {
		const value = event.value;
		if (value === 'all') {
			this.themeValues = [];
			return false;
		}
		this.themeValues = await this.filterService.getThemeValues(value);
	}

	getThemeValues() {
		if (this.formGroup.get('theme.description').value === 'all') {
			return [{name: 'Todos', value: 'all'}];
		}
		return this.themeValues;
	}
}
