import {Component, Input} from '@angular/core';

import {Vision} from 'src/app/models/vision.model';

@Component({
    selector: 'app-vision-detailed',
    templateUrl: './vision-detailed.component.html',
    styleUrls: ['./vision-detailed.component.css']
})
export class VisionDetailedComponent {

    @Input() detailedVisions: Vision[] = [];

    @Input() formattedFilterDate: string;

    date: string;

    constructor() {
    }

    trackById(index, item) {
        return item.id;
    }

}
