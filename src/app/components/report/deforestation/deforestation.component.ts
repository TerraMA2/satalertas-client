import {Component, Input} from '@angular/core';

import {Vision} from 'src/app/models/vision.model';

@Component({
    selector: 'app-deforestation',
    templateUrl: './deforestation.component.html',
    styleUrls: ['./deforestation.component.css']
})
export class DeforestationComponent {

    @Input() deforestations: Vision[] = [];

    constructor() {
    }

    trackById(index, item) {
        return item.id;
    }

}
