import {Component, Input} from '@angular/core';

import {Vision} from 'src/app/models/vision.model';

@Component({
    selector: 'app-burned-areas',
    templateUrl: './burned-areas.component.html',
    styleUrls: ['./burned-areas.component.css']
})
export class BurnedAreasComponent {

    @Input() burnedAreas: Vision[] = [];

    constructor() {
    }

    trackById(index, item) {
        return item.id;
    }

}
