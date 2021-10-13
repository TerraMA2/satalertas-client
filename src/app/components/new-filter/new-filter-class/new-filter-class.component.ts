import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilterService } from '../../../services/filter.service';

@Component({
	selector: 'app-filter-class',
	templateUrl: './new-filter-class.component.html',
	styleUrls: ['./new-filter-class.component.css']
})
export class NewFilterClassComponent implements OnInit {

	@Input() formGroup: FormGroup;
	classDeterOptions;
	// classProdesOptions;
	// classFireSpotOptions;
	// classBurnedAreaOptions;

	constructor(
		private filterService: FilterService
	) {
	}

	async ngOnInit() {
		const response = await this.filterService.getClasses('deter');
		this.classDeterOptions = [{ label: 'Todos', value: 'all' }, ...response.data];
		// this.classProdesOptions = [
		//   {label: 'Todos', value: 'all'}
		// ];
		// this.classFireSpotOptions = [
		//   {label: 'Todos', value: 'all'}
		// ];
		// this.classBurnedAreaOptions = [
		//   {label: 'Todos', value: 'all'}
		// ];
	}

}
