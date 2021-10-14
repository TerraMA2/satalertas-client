import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfigService } from '../../../services/config.service';

@Component({
	selector: 'app-filter-area',
	templateUrl: './new-filter-area.component.html',
	styleUrls: ['./new-filter-area.component.css']
})
export class NewFilterAreaComponent implements OnInit {

	@Input() formGroup: FormGroup;

	areaDeterOptions: any[];
	areaProdesOptions: any[];
	areaFireSpotOptions: any[];
	areaBurnedAreaOptions: any[];
	areaPropertyOptions: any[];
	label: string;
	DETERLabel: string;
	PRODESLabel: string;
	fireSpotLabel: string;
	burnedAreaLabel: string;

	constructor(
		private configService: ConfigService
	) {
	}

	ngOnInit(): void {
		const filterAreaConfig = this.configService.getNewFilterConfig('area');
		this.label = filterAreaConfig.label;
		this.DETERLabel = filterAreaConfig.DETERLabel;
		this.PRODESLabel = filterAreaConfig.PRODESLabel;
		this.fireSpotLabel = filterAreaConfig.fireSpotLabel;
		this.burnedAreaLabel = filterAreaConfig.burnedAreaLabel;
		this.areaDeterOptions = filterAreaConfig.options;
		this.areaProdesOptions = filterAreaConfig.options;
		this.areaFireSpotOptions = filterAreaConfig.fireSpotOptions;
		this.areaBurnedAreaOptions = filterAreaConfig.options;
		this.areaPropertyOptions = filterAreaConfig.options;
	}

}
