import {Component, Input} from '@angular/core';

import {Vision} from 'src/app/models/vision.model';

import {Legend} from 'src/app/models/legend.model';

@Component({
    selector: 'app-vision',
    templateUrl: './vision.component.html',
    styleUrls: ['./vision.component.css']
})
export class VisionComponent {

    @Input() visions: Vision[] = [];

    @Input() legends: Legend[] = [];

    @Input() formattedFilterDate: string;

    constructor() {
    }

    trackById(index, item) {
        return item.id;
    }
}
