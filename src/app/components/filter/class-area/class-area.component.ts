import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FilterClass} from '../../../models/filter-class.model';
import {ConfigService} from '../../../services/config.service';
import {FilterAlertAnalyses} from '../../../models/filter-alert-type-analyzes.model';
import {AnalyzeService} from '../../../services/analyze.service';

@Component({
    selector: 'app-class-area',
    templateUrl: './class-area.component.html',
    styleUrls: ['./class-area.component.css']
})
export class ClassAreaComponent implements OnInit, AfterViewInit {

    @Input() disable;
    @Output() onChangeClassFilter: EventEmitter<FilterClass> = new EventEmitter<FilterClass>();

    filter;
    filterClass: FilterClass;

    constructor(
        private configService: ConfigService,
        private analyzeService: AnalyzeService
    ) {
    }

    ngOnInit() {
        this.filterClass = new FilterClass('ALL', []);
        this.filter = this.configService.getConfig('map').filter.classSearch;
    }

    async ngAfterViewInit() {
        for (const analyze of this.filter.analyzes) {
            const options = await this.analyzeService.getAllClassByType(analyze.value);

            this.filterClass.analyzes.push(new FilterAlertAnalyses(analyze.label, analyze.value, undefined, options));
        }
    }

    onChange(event) {
        const result = this.filterClass.radioValue !== 'ALL' ? this.filterClass : undefined;

        this.onChangeClassFilter.emit(result);
    }

    public clearAll() {
        this.filterClass = new FilterClass('ALL', this.filterClass.analyzes);
        this.onChangeClassFilter.emit(this.filterClass);
    }

    checkValid() {
        return this.filterClass && this.filterClass.radioValue;
    }

    checkAnalyzesValid() {
        return this.filterClass &&
            this.filterClass.radioValue &&
            (this.filterClass.radioValue !== 'ALL') &&
            this.filterClass.analyzes &&
            (this.filterClass.analyzes.length > 0);
    }

    trackById(index, item) {
        return item.id;
    }
}
