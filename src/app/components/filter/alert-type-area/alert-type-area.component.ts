import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FilterAlertType} from '../../../models/filter-alert-type.model';
import {ConfigService} from '../../../services/config.service';
import {FilterAlertAnalyses} from '../../../models/filter-alert-type-analyzes.model';

@Component({
    selector: 'app-alert-type-area',
    templateUrl: './alert-type-area.component.html',
    styleUrls: ['./alert-type-area.component.css']
})
export class AlertTypeAreaComponent implements OnInit, AfterViewInit {
    @Input() disable;
    @Output() onchangeAlertType: EventEmitter<FilterAlertType> = new EventEmitter<FilterAlertType>();
    alertType: FilterAlertType;
    filter;

    constructor(
        private configService: ConfigService
    ) {
    }

    ngOnInit() {
        this.alertType = new FilterAlertType('ALL', []);
        this.filter = this.configService.getConfig('map').filter.alertType;
    }

    ngAfterViewInit() {
        this.filter.analyzes.forEach(analyze => {
            const options = (analyze.value === 'burned') ? this.filter.optionsFocos : this.filter.options;

            this.alertType.analyzes.push(new FilterAlertAnalyses(analyze.label, analyze.value, undefined, options));
        });
    }

    onChange() {
        const result = this.alertType.radioValue !== 'ALL' ? this.alertType : undefined;

        this.onchangeAlertType.emit(result);
    }

    onChangeAnalyzeOption(option) {
        this.alertType.analyzes.forEach(analyze => {
            if (analyze.valueOption && analyze.valueOption['value'] && (analyze.valueOption['value'] !== 6)) {
                analyze.valueOptionBiggerThen = undefined;
            }
        });
        this.onChange();
    }

    public clearAll() {
        this.alertType = new FilterAlertType('ALL', this.alertType.analyzes);
        this.onchangeAlertType.emit(this.alertType);
    }

    checkAlertTypeValid() {
        return this.alertType && this.alertType.radioValue;
    }

    checkAnalyzesValid() {
        return this.alertType &&
            this.alertType.radioValue &&
            (this.alertType.radioValue !== 'ALL') &&
            this.alertType.analyzes &&
            (this.alertType.analyzes.length > 0);
    }

    isCustomSelected(analisys) {
        return analisys.valueOption && analisys.valueOption.value && analisys.valueOption.value === 6;
    }

    trackById(index, item) {
        return item.id;
    }

}
