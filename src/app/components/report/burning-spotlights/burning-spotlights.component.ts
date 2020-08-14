import {Component, Input} from '@angular/core';

import {Vision} from 'src/app/models/vision.model';

@Component({
    selector: 'app-burning-spotlights',
    templateUrl: './burning-spotlights.component.html',
    styleUrls: ['./burning-spotlights.component.css']
})
export class BurningSpotlightsComponent {

    @Input() burningSpotlights: Vision[] = [];

    constructor() {
    }

    trackById(index, item) {
        return item.id;
    }
}
