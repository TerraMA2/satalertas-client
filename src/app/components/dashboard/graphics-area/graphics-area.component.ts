import {Component, Input, OnInit} from '@angular/core';

import {AlertGraphic} from '../../../models/alert-graphic.model';

@Component({
    selector: 'app-graphics-area',
    templateUrl: './graphics-area.component.html',
    styleUrls: ['./graphics-area.component.css']
})
export class GraphicsAreaComponent implements OnInit {
    @Input() alertGraphics: AlertGraphic [] = [];

    constructor() {
    }

    ngOnInit() {
    }

    trackById(index, item) {
        return item.id;
    }

}
