import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfigService } from '../../../services/config.service';

@Component({
	selector: 'app-filter-search',
	templateUrl: './new-filter-search.component.html',
	styleUrls: ['./new-filter-search.component.css']
})
export class NewFilterSearchComponent implements OnInit {

	@Input() formGroup: FormGroup;
	label: string;

	constructor(
		private configService: ConfigService
	) {
	}

	ngOnInit(): void {
		const filterSearchConfig = this.configService.getNewFilterConfig('search');
		this.label = filterSearchConfig.label;
	}

	onIsSearchClicked(event) {
		const checked = event.checked;
		if (checked) {
			this.formGroup.reset({
				theme: {
					description: 'all',
					value: 'none'
				},
				class: {
					deterValue: 'all',
					prodesValue: 'all',
					fireSpotValue: 'all',
					burnedAreaValue: 'all'
				},
				search: {
					isSearch: true,
					description: 'stateCAR',
					value: null
				}
			});
		}
	}

	getSearchMask() {
		let mask = '';
		if (this.formGroup.get('search.description').value === 'stateCAR') {
			mask = 'AAA/0000';
		} else if (this.formGroup.get('search.description').value === 'federalCAR') {
			mask = 'SS-0000000-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
		} else if (this.formGroup.get('search.description').value === 'ownerCPF') {
			mask = '000.000.000-00||00.000.000/0000-00';
		}
		return mask;
	}

}
