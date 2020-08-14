import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-burned-areas-chart',
    templateUrl: './burned-areas-chart.component.html',
    styleUrls: ['./burned-areas-chart.component.css']
})
export class BurnedAreasChartComponent implements OnInit {

    @Input() burnedAreasChartData;

    @Input() burnedAreasPerPropertyChartDatas;

    options;

    constructor() {
    }

    ngOnInit() {
        this.options = {
            title: {
                display: false
            }
        };
    }

    trackById(index, item) {
        return item.id;
    }

}
