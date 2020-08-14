import {FilterAlertType} from './filter-alert-type.model';
import {FilterAuthorization} from './filter-authorization.model';
import {FilterTheme} from './filter-theme.model';
import {FilterSpecificSearch} from './filter-specific-search.model';
import {FilterClass} from './filter-class.model';

export class FilterParam {
    constructor(
        public themeSelected: FilterTheme,
        public alertType: FilterAlertType,
        public autorization: FilterAuthorization,
        public specificSearch: FilterSpecificSearch,
        public classSearch?: FilterClass
    ) {
    }
}
