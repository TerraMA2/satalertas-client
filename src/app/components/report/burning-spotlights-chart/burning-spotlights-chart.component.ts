import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-burning-spotlights-chart',
    templateUrl: './burning-spotlights-chart.component.html',
    styleUrls: ['./burning-spotlights-chart.component.css']
})
export class BurningSpotlightsChartComponent implements OnInit {

    @Input() data;

    options;

    constructor() {
    }

    ngOnInit() {
        this.options = {
            title: {
                display: true,
                text: 'Focos',
                fontSize: 16
            },
            legend: {
                display: false
            }
        };
    }

}
