import {Component, Input} from '@angular/core';

import {Vision} from 'src/app/models/vision.model';

@Component({
    selector: 'app-image-history',
    templateUrl: './image-history.component.html',
    styleUrls: ['./image-history.component.css']
})
export class ImageHistoryComponent {

    @Input() landsatHistories: Vision[] = [];

    constructor() {
    }

    trackById(index, item) {
        return item.id;
    }

}
