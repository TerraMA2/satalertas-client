import {Component, Input} from '@angular/core';

import {Vision} from 'src/app/models/vision.model';

@Component({
    selector: 'app-deforestation-history-prodes',
    templateUrl: './deforestation-history-prodes.component.html',
    styleUrls: ['./deforestation-history-prodes.component.css']
})
export class DeforestationHistoryProdesComponent {

    @Input() deforestationHistoryProdes: Vision[] = [];

    constructor() {
    }

    trackById(index, item) {
        return item.id;
    }

}
