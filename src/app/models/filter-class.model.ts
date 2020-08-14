import {FilterAlertAnalyses} from './filter-alert-type-analyzes.model';

export class FilterClass {
    constructor(
        public radioValue: string,
        public analyzes?: FilterAlertAnalyses[]
    ) {
    }
}
