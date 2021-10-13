import { FilterTheme } from './new-filter-theme.model';
import { FilterArea } from './new-filter-area.model';
import { FilterClass } from './new-filter-class.model';
import { FilterSearch } from './new-filter-search.model';

export interface Filter {
  theme: FilterTheme,
  area: FilterArea,
  class: FilterClass,
  search: FilterSearch
}
