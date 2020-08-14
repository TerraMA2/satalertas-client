import {Component, Input} from '@angular/core';

import {Vision} from 'src/app/models/vision.model';

@Component({
    selector: 'app-deforestation-history-deter',
    templateUrl: './deforestation-history-deter.component.html',
    styleUrls: ['./deforestation-history-deter.component.css']
})
export class DeforestationHistoryDeterComponent {

    @Input() deforestationHistoryDeters: Vision[] = [];

    constructor() {
    }

    trackById(index, item) {
        return item.id;
    }

}
