import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { Layer } from '../models/layer.model';
import { Util } from '../utils/util';
import * as L from 'leaflet';
import { LatLngBounds } from 'leaflet';
import { environment } from '../../environments/environment';
import { HTTPService } from './http.service';
import { LayerType } from '../enum/layer-type.enum';
import { FilterParam } from '../models/filter-param.model';
import { FilterUtils } from '../utils/filter.utils';
import { LayerInfoFeature } from '../models/layer-info-feature.model';
import { Response } from '../models/response.model';
import { LayerInfo } from '../models/layer-info.model';
import { InfoColumnsService } from './info-columns.service';

const URL_REPORT_SERVER = environment.serverUrl;

@Injectable({
	providedIn: 'root'
})
export class MapService {

	resetLayers = new Subject();

	clearMap = new Subject();

	reportTable = new Subject();

	layerToolOpen = new Subject<object>();

	layerToolClose = new Subject();

	legendClose = new Subject();

	layerExtent = new Subject<Layer>();

	layerOpactity = new Subject<object>();

	layerSlider = new Subject<object>();

	clearMarkers = new Subject();

	constructor(
		private hTTPService: HTTPService,
		private infoColumnsService: InfoColumnsService
	) {
	}

	getPopupContent(data, name, infoColumns = null) {
		let popupContent = '';
		let popupContentBody = '';
		Object.keys(data).forEach(key => {
			if (key === 'lat' || key === 'long') {
				return;
			}
			const column = infoColumns[key];
			let show = true;
			let alias;
			if (column) {
				alias = column.alias;
				show = column.show === true;
			} else {
				alias = key;
			}
			if (show) {
				if (alias === 'CPF/CNPJ') {
					popupContentBody += `
                        <tr>
                           <td>${ alias }</td>
                           <td>${ this.formatterCpfCnpj(data[key]) }</td>
                        </tr>`;
				} else {
					popupContentBody += `
                        <tr>
                            <td>${ alias }</td>
                            <td>${ data[key] }</td>
                        </tr>`;
				}
			}
		});

		popupContent += `
            <br />
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                    <tr>
                        <th colspan="2">${ name }</th>
                    </tr>
                </thead>
                ${ popupContentBody }
              </table>
            </div>
        `;

		return popupContent;
	}

	async getPopupInfo(gid, codGroup, filter?) {
		const url = `${ URL_REPORT_SERVER }/map/getPopupInfo`;
		const params = {
			params: {
				gid,
				codGroup,
				filter
			}
		};

		return await this.hTTPService.get<any>(url, params).toPromise();
	}

	formatterCpfCnpj(cpfCnpj) {
		if (cpfCnpj) {
			const listCpfCnpj = cpfCnpj.split(',');

			cpfCnpj = '';
			if (listCpfCnpj.length > 0) {
				listCpfCnpj.forEach(value => {
					if (!cpfCnpj) {
						cpfCnpj = Util.cpfCnpjMask(value);
					} else {
						cpfCnpj += `, ${ Util.cpfCnpjMask(value) }`;
					}
				});
			}
		}

		return cpfCnpj ? cpfCnpj : '';
	}

	getLayerById(leafletId, map: L.Map) {
		let layer = null;
		map.eachLayer((tileLayer: L.TileLayer.WMS) => {
			if (leafletId === tileLayer['_leaflet_id']) {
				layer = tileLayer;
			}
		});
		return layer;
	}

	setOpacity(layer: Layer, value: number, map: L.Map) {
		const tileLayer: L.TileLayer.WMS = this.getLayerById(layer.leafletId, map);
		value = value / 100;
		tileLayer.setOpacity(value);
	}

	setExtent(layer: Layer, map: L.Map) {
		const tileLayer: L.TileLayer.WMS = this.getLayerById(layer.leafletId, map);
		const bbox = layer.layerData.bbox;
		const bboxArray = bbox.split(',');
		const latLngBounds = new LatLngBounds([parseFloat(bboxArray[2]), parseFloat(bboxArray[3])], [parseFloat(bboxArray[0]), parseFloat(bboxArray[1])]);
		map.fitBounds(latLngBounds);
	}

	setFilter(layer) {
		if (layer.type !== LayerType.ANALYSIS && layer.type !== LayerType.DYNAMIC) {
			return layer;
		}

		const currentDateInput = JSON.parse(localStorage.getItem('dateFilter'));

		if (layer.cod === 'CAR_X_FOCOS') {
			layer.layerData.viewparams = `date1:${ currentDateInput[0].substring(0, 10) };date2:${ currentDateInput[1].substring(0, 10) }`;
		} else {
			layer.layerData.time = `${ currentDateInput[0] }/${ currentDateInput[1] }`;
		}

		if (layer.type === LayerType.DYNAMIC) {
			return layer;
		}

		layer = this.setCqlFilter(layer);

		return layer;
	}

	setCqlFilter(layer) {
		const filter: FilterParam = JSON.parse(localStorage.getItem('filterState'));

		if (!filter || (filter.alertType.radioValue === 'ALL') && (filter.autorization.value === 'ALL') &&
			!filter.specificSearch.isChecked && !filter.themeSelected.type) {
			if (layer.layerData.cql_filter) {
				delete layer.layerData.cql_filter;
			}

			layer.layerData.layers = layer.filter.default.view;

			return layer;
		}

		if (filter.specificSearch.isChecked) {
			return this.setSpecificSearch(layer, filter);
		}

		layer = this.setThemeSelected(layer, filter, true);
		layer = this.setAlertType(layer, filter, false);

		return layer;
	}

	setSpecificSearch(layer, filter) {
		if ((!filter.specificSearch || !filter.specificSearch.isChecked)) {
			return layer;
		}

		if (layer.layerData.cql_filter) {
			delete layer.layerData.cql_filter;
		}

		layer.layerData.layers = layer.filter.default.view;

		const specificSearch = {
			car(value) {
				return (layer.isPrimary) ? ` de_car_validado_sema_numero_do1 = '${ value }' ` : ` ${ layer.tableOwner }_de_car_validado_sema_numero_do1 = '${ value }' `;
			},
			car_federal(value) {
				return (layer.isPrimary) ? ` de_car_validado_sema_numero_do2 = '${ value }' ` : ` ${ layer.tableOwner }_de_car_validado_sema_numero_do2 = '${ value }' `;
			},
			cpf(value) {
				const newValue = value ? value.replace(/\D/g, '') : '';
				return (layer.isPrimary) ? ` de_car_validado_sema_cpfcnpj like '%${ newValue }%' ` : ` ${ layer.tableOwner }_de_car_validado_sema_cpfcnpj = '%${ newValue }%'`;
			}
		};

		layer.layerData.cql_filter = specificSearch[filter.specificSearch.CarCPF.toLowerCase()](filter.specificSearch.inputValue);

		return layer;
	}

	setThemeSelected(layer, filter, cleanCqlFilter) {
		if (filter.specificSearch && filter.specificSearch.isChecked || (!filter.themeSelected.type)) {
			if (layer.layerData.cql_filter) {
				delete layer.layerData.cql_filter;
			}
			layer.layerData.layers = layer.filter.default.view;

			return layer;
		}

		const cqlFilter = cleanCqlFilter || !layer.layer.layerData.cql_filter ? '' : layer.layer.layerData.cql_filter;

		return FilterUtils.themeSelected(filter, layer, cqlFilter);
	}

	setAlertType(layer, filter, cleanCqlFilter) {
		if ((filter.specificSearch && filter.specificSearch.isChecked) || !filter.alertType ||
			!filter.alertType.radioValue || (filter.alertType.radioValue === 'ALL')) {
			return layer;
		}

		let cqlFilter = cleanCqlFilter || !layer.layerData.cql_filter ? '' : layer.layerData.cql_filter;

		filter.alertType.analyzes.forEach(analyze => {

			const values = this.getValues(analyze);

			if (analyze.valueOption && analyze.valueOption.value) {
				if ((analyze.type && analyze.type === 'deter') && (layer.codgroup === 'DETER') && (layer.cod === 'CAR_X_DETER')) {
					cqlFilter += cqlFilter ? ' and ' : '';
					cqlFilter += ` calculated_area_ha ${ values.columnValue } `;
				}

				if ((analyze.type && analyze.type === 'deforestation') && (layer.codgroup === 'PRODES') && (layer.cod === 'CAR_X_PRODES')) {
					cqlFilter += cqlFilter ? ' and ' : '';
					cqlFilter += ` calculated_area_ha ${ values.columnValue } `;
				}

				if ((analyze.type && analyze.type === 'burned') && (layer.codgroup === 'BURNED') && (layer.cod === 'CAR_X_FOCOS')) {
					cqlFilter += cqlFilter ? ' and ' : '';
					cqlFilter += ` num_car_focos ${ values.columnValueFocos } `;
				}

				if ((analyze.type && analyze.type === 'burned_area') && (layer.codgroup === 'BURNED_AREA') && (layer.cod === 'CAR_X_AREA_Q')) {
					cqlFilter += cqlFilter ? ' and ' : '';
					cqlFilter += ` calculated_area_ha ${ values.columnValue } `;
				}

				if ((analyze.type && analyze.type === 'car_area')) {
					cqlFilter += cqlFilter ? ' and ' : '';
					cqlFilter += ` ${ layer.filter.car.field } ${ values.columnValue } `;
				}
			}
		});

		if (cqlFilter) {
			layer.layerData.cql_filter = cqlFilter;
		}

		return layer;
	}

	getValues(analyze) {
		const values = { columnValue: '', columnValueFocos: '', min: null, max: null };
		if (analyze.valueOption && analyze.valueOption.value) {
			switch (analyze.valueOption.value) {
				case 1 :
					values.columnValue = ` <= 5 `;
					values.columnValueFocos = ` BETWEEN 0 AND 10 `;
					values.min = 0;
					values.max = 10;
					break;
				case 2:
					values.columnValue = ` BETWEEN 5 AND 25 `;
					values.columnValueFocos = ` BETWEEN 10 AND 20 `;
					values.min = 10;
					values.max = 20;
					break;
				case 3:
					values.columnValue = ` BETWEEN 25 AND 50 `;
					values.columnValueFocos = ` BETWEEN 20 AND 50 `;
					values.min = 20;
					values.max = 50;
					break;
				case 4:
					values.columnValue = ` BETWEEN 50 AND 100 `;
					values.columnValueFocos = ` BETWEEN 50 AND 100 `;
					values.min = 50;
					values.max = 100;
					break;
				case 5:
					values.columnValue = ` >= 100 `;
					values.columnValueFocos = ` > 100 `;
					values.min = 100;
					values.max = 9999999999;
					break;
				case 6:
					values.columnValue = ` > ${ analyze.valueOptionBiggerThen } `;
					values.columnValueFocos = ` > ${ analyze.valueOptionBiggerThen } `;
					values.min = analyze.valueOptionBiggerThen;
					values.max = 9999999999;
					break;
			}
		}
		return values;
	}

	getMap(maxZoom) {
		return L.map('map', { maxZoom });
	}

	panMap(map, latLng, zoom) {
		map.setView(latLng, zoom);
	}

	getLayer(layerData) {
		layerData.crs = L.CRS.EPSG4326;
		return L.tileLayer.wms(layerData.url, layerData);
	}

	getMarkersGroup() {
		return L.markerClusterGroup(
			{
				chunkedLoading: true,
				animate: false
			});
	}

	getLayerControl(layers) {
		return L.control.layers(
			{}, {},
			layers
		);
	}

	getFullScreenControl(options) {
		return L.control.fullscreen(options);
	}

	getScaleControl(options) {
		return L.control.scale(options);
	}

	getLegendControl() {
		return L.Control.extend({
			onAdd: () => {
				const div = L.DomUtil.create('div');
				div.innerHTML = `
          <div id="legendBtn" class="leaflet-control-layers leaflet-custom-icon leaflet-legend" title="Legendas">
            <a><i class='fas fa-th-list'></i></a>
          </div>`;
				return div;
			}
		});
	}

	getTableControl() {
		return L.Control.extend({
			onAdd: () => {
				const div = L.DomUtil.create('div');
				div.innerHTML = `
          <div id="tableBtn" class="leaflet-control-layers leaflet-custom-icon" title="Tabela">
            <a><i class='fas fa-table'></i></a>
          </div>`;
				return div;
			}
		});
	}

	getReportTableControl() {
		return L.Control.extend({
			onAdd: () => {
				const div = L.DomUtil.create('div');
				div.innerHTML = `
                <div id="reportTableBtn" class="leaflet-control-layers leaflet-custom-icon leaflet-report-table-icon" title="Relatórios">
                  <a><i class='fas fa-file-alt'></i> Relatórios</a>
                </div>`;
				return div;
			}
		});
	}

	getCoordinatesControl() {
		return L.Control.extend({
			onAdd: map => {
				const container = L.DomUtil.create('div');
				map.addEventListener('mousemove', e => {
					container.innerHTML = `
          <div id="coordinates" class="leaflet-control-coordinates leaflet-control-layers leaflet-latlong-icon">
          <strong>Lat:</strong>
          ${ e.latlng.lat.toFixed(4) }
          &nbsp;
          <strong>Long:</strong>
          ${ e.latlng.lng.toFixed(4) }
          </div>
          `;
				});
				L.DomEvent.disableClickPropagation(container);
				return container;
			}
		});
	}

	getInfoControl() {
		return L.Control.extend({
			onAdd: () => {
				const div = L.DomUtil.create('div');
				div.innerHTML = `
          <div id="infoBtn" class="leaflet-control-layers leaflet-custom-icon leaflet-info" title="Informação">
            <a><i class='fas fa-info'></i></a>
          </div>`;
				return div;
			}
		});
	}

	async getFeatureInfo(selectedLayers, map, latLong, layerPoint, markerInfo) {
		let popupContent = `<div class="popup-container-feature-info">`;

		if (selectedLayers.length === 0) {
			popupContent += `<h2>Layer não encontrado.</h2>`;
		}

		const infoColumns = await this.infoColumnsService.getInfoColumns().then((response: Response) => response);

		let popupTable = '';
		for (const selectedLayer of selectedLayers) {
			const layerInfoColumn = infoColumns[selectedLayer.codgroup];
			const layer = this.getLayer(selectedLayer.layerData);
			const layerName = selectedLayer.label;

			let params = null;
			let url = '';
			if (selectedLayer.type === LayerType.ANALYSIS || selectedLayer.type === LayerType.DYNAMIC) {
				url = `${ environment.geoserverUrl }/wfs`;
				params = this.getWFSFeatureInfoParams(layer, latLong, selectedLayer.type, selectedLayer.cod);
			} else {
				url = `${ environment.geoserverUrl }/wms`;
				params = this.getWMSFeatureInfoParams(layer, latLong, layerPoint, map);
			}

			await this.hTTPService.get<any>(url, params).toPromise().then((layerInfo: LayerInfo) => {
				const features = layerInfo.features;
				if (features && features.length > 0) {
					popupTable += this.getFeatureInfoPopup(layerName, features, layerInfoColumn);
				}
			});
		}
		if (!popupTable) {
			popupTable = 'Nenhuma informação foi encontrada.';
		}
		popupContent += popupTable;

		popupContent += `</div>`;

		markerInfo.bindPopup(popupContent, { maxWidth: 500, maxHeight: 500 });
		markerInfo.addTo(map);
		markerInfo.openPopup();
	}

	getWMSFeatureInfoParams(layer: L.TileLayer.WMS, latLng, layerPoint, map) {
		const containerPoint = map.layerPointToContainerPoint(layerPoint);
		const bbox = map.getBounds().toBBoxString();
		const mapSize = map.getSize();
		const width = mapSize.x;
		const height = mapSize.y;
		const x = Math.round(containerPoint.x);
		const y = Math.round(containerPoint.y);
		return {
			request: 'GetFeatureInfo',
			service: 'WMS',
			srs: 'EPSG:4674',
			styles: layer.wmsParams.styles,
			transparent: layer.wmsParams.transparent,
			version: layer.wmsParams.version,
			format: layer.wmsParams.format,
			bbox,
			height,
			width,
			layers: layer.wmsParams.layers,
			query_layers: layer.wmsParams.layers,
			info_format: 'application/json',
			x,
			y
		};
	}

	getWFSFeatureInfoParams(layer: L.TileLayer.WMS, latLng, layerType, layerCod) {
		let geomColumn = 'intersection_geom';
		if (layerType === LayerType.DYNAMIC) {
			geomColumn = 'geom';
			if (layerCod === 'FOCOS') {
				geomColumn = 'geomatria';
			}
		}
		return {
			request: 'GetFeature',
			service: 'WFS',
			srs: 'EPSG:4674',
			version: '2.0',
			outputFormat: 'application/json',
			typeNames: layer.wmsParams.layers,
			count: 1,
			cql_filter: `INTERSECTS(${ geomColumn }, POINT(${ latLng.lat } ${ latLng.lng }))`
		};
	}

	getFeatureInfoPopup(layerName: string, features: LayerInfoFeature[], infoColumns = null) {
		let popupContent = '';
		if (features) {
			features.forEach(feature => {
				const properties = feature.properties;
				if (properties) {
					popupContent += this.getPopupContent(properties, layerName, infoColumns);
				}
			});
		}
		return popupContent;
	}

	getRestoreMapControl() {
		return L.Control.extend({
			onAdd: () => {
				const div = L.DomUtil.create('div');
				div.innerHTML = `
                  <div id="restoreMapBtn" class="leaflet-control-layers leaflet-custom-icon leaflet-restore-map" title="Restaurar mapa">
                    <a><i class='fas fa-crosshairs'></i></a>
                  </div>`;
				return div;
			}
		});
	}

	getVisibleLayersControl() {
		return L.Control.extend({
			onAdd: () => {
				const div = L.DomUtil.create('div');
				div.innerHTML = `
            <div id="visibleLayersBtn" class="leaflet-control-layers leaflet-custom-icon" title="Layers visíveis">
              <a><i class='fas fa-list'></i></a>
            </div>`;
				return div;
			}
		});
	}
}
