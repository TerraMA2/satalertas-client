import {Component, Input, OnInit} from '@angular/core';

import {Layer} from 'src/app/models/layer.model';

import {MapService} from '../../../services/map.service';

@Component({
    selector: 'app-legend',
    templateUrl: './legend.component.html',
    styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit {

    @Input() selectedLayers: Layer[] = [];

    @Input() displayLegend = false;

    constructor(
        private mapService: MapService
    ) {
    }

    ngOnInit() {
    }

    onLegendHide() {
        this.mapService.legendClose.next();
    }

    trackById(index, item) {
        return item.id;
    }
}
