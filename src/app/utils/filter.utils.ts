export class FilterUtils {

  constructor( ) { }

  public static themeSelected( filter, layer, cqlFilter) {

    if (filter.themeSelected.value.value !== 'ALL') {
      const value = {
        name: `'${filter.themeSelected.value.name}'`,
        gid: filter.themeSelected.value.gid,
        geocode: `'${filter.themeSelected.value.geocodigo}'`
      };

      layer.layerData.cql_filter =
        FilterUtils.setCqlFilter(
          value[layer.filter[filter.themeSelected.type].value], layer.filter[filter.themeSelected.type].field, cqlFilter);
    } else {
      delete layer.layerData.cql_filter;
    }

    layer.layerData.layers = layer.filter[filter.themeSelected.type].view;

    return layer;
  }


  private static setCqlFilter(value, column, cqlFilter) {
    let cFilter = cqlFilter ? cqlFilter : '';

    cFilter += cFilter ? '; ' : '';
    cFilter += ` ${column} = ${value} `;

    return cFilter;
  }
}
