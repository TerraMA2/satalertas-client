import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SettingsService {

	openLayersAdvancedModal = new Subject<any>();
	getLayersAdvancedModalEditions = new Subject<any>();

	constructor(
	) {
	}

}
