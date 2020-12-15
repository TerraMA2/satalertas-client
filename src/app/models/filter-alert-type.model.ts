import {FilterAlertAnalyses} from './filter-alert-type-analyzes.model';

export class FilterAlertType {
    constructor(
        public radioValue: string,
        public analyzes?: FilterAlertAnalyses[]
    ) {
    }
}
