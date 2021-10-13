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
	themeValues;
	themeOptions;

	constructor(
		private filterService: FilterService,
		private configService: ConfigService
	) {
	}

	ngOnInit(): void {
		this.themeOptions = this.configService.getNewFilterConfig('filterTheme').options;
	}

	async onThemeOptionChange(event) {
		const value = event.value;
		if (value === 'all') {
			return false;
		}
		this.themeValues = await this.filterService.getThemeValues(value);
	}

}
