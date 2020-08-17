import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-history-prodes-chart',
    templateUrl: './history-prodes-chart.component.html',
    styleUrls: ['./history-prodes-chart.component.css']
})
export class HistoryProdesChartComponent implements OnInit {

    @Input() data;

    options;

    constructor() {
    }

    ngOnInit() {
        this.options = {
            title: {
                display: true,
                text: 'PRODES',
                fontSize: 16
            },
            legend: {
                display: false
            }
        };
    }

}
