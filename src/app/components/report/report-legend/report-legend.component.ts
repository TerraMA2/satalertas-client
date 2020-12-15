import {Component, Input, OnInit} from '@angular/core';

import {Legend} from 'src/app/models/legend.model';

import {ConfigService} from 'src/app/services/config.service';

@Component({
    selector: 'app-report-legend',
    templateUrl: './report-legend.component.html',
    styleUrls: ['./report-legend.component.css']
})
export class ReportLegendComponent implements OnInit {

    @Input() legends: Legend[] = [];

    constructor(
        private configService: ConfigService
    ) {
    }

    ngOnInit() {
        this.configService.getReportConfig();
    }

    trackById(index, item) {
        return item.id;
    }

}
