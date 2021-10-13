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

	constructor(
		private configService: ConfigService
	) {
	}

	ngOnInit(): void {
		this.areaDeterOptions = this.configService.getNewFilterConfig('filterArea').options;
		this.areaProdesOptions = this.configService.getNewFilterConfig('filterArea').options;
		this.areaFireSpotOptions = this.configService.getNewFilterConfig('filterArea').fireSpotOptions;
		this.areaBurnedAreaOptions = this.configService.getNewFilterConfig('filterArea').options;
		this.areaPropertyOptions = this.configService.getNewFilterConfig('filterArea').options;
	}

}
