import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-history-deter-chart',
    templateUrl: './history-deter-chart.component.html',
    styleUrls: ['./history-deter-chart.component.css']
})
export class HistoryDeterChartComponent implements OnInit {

    @Input() data;

    options;

    constructor() {
    }

    ngOnInit() {
        this.options = {
            title: {
                display: true,
                text: 'DETER',
                fontSize: 16
            },
            legend: {
                display: false
            }
        };
    }

}
