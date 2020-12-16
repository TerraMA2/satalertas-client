import {AfterViewInit, Component, OnInit} from '@angular/core';

import * as L from 'leaflet';

import 'leaflet.markercluster';

import 'leaflet.fullscreen';

import 'leaflet-draw';

import * as Search from 'leaflet-search';

import {HTTPService} from '../../services/http.service';

import {ConfigService} from '../../services/config.service';

import {SidebarService} from 'src/app/services/sidebar.service';

import {MapService} from 'src/app/services/map.service';

import {LayerType} from 'src/app/enum/layer-type.enum';

import {Layer} from 'src/app/models/layer.model';

import {LayerGroup} from 'src/app/models/layer-group.model';

import {FilterService} from '../../services/filter.service';

import {PopupService} from 'src/app/services/popup.service';

import {LayerInfo} from 'src/app/models/layer-info.model';

import {LayerInfoFeature} from 'src/app/models/layer-info-feature.model';

import {SelectedMarker} from 'src/app/models/selected-marker.model';

import {TableService} from 'src/app/services/table.service';

import {View} from '../../models/view.model';

import {FilterUtils} from '../../utils/filter.utils';

import {AuthService} from 'src/app/services/auth.service';

import {Response} from '../../models/response.model';

import {environment} from 'src/environments/environment';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit, AfterViewInit/*, OnDestroy*/ {

    selectedLayers: Layer[] = [];
    layerTool: Layer;
    toolSelected: string;
    markerClusterGroup: L.MarkerClusterGroup;
    selectedPrimaryLayer: Layer;
    markerInfo: L.Marker;
    selectedMarker: SelectedMarker;
    tableSelectedLayer: L.TileLayer.WMS;
    reportTable;
    displayTable = false;
    displayLegend = false;
    displayInfo = false;
    // displayVisibleLayers = false;
    displayLayerTools = false;
    tableReportActive = false;
    tablePanelHeight;
    tableHeight;
    tableFullscreen = false;
    selectedBaseLayer: string;
    isLoading = false;
    private map: L.Map;
    private mapConfig;
    private tableConfig;
    private zoomIn = false;
    private layerControl: L.Control.Layers;
    private searchControl;

    constructor(
        private hTTPService: HTTPService,
        private configService: ConfigService,
        private sidebarService: SidebarService,
        private tableService: TableService,
        private mapService: MapService,
        private filterService: FilterService,
        private linkPopupService: PopupService,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.mapConfig = this.configService.getMapConfig();
        this.tableConfig = this.configService.getMapConfig('table');

        const tableConfig = this.tableConfig;
        this.tablePanelHeight = tableConfig.panelHeight;
        this.tableHeight = tableConfig.height;

        this.sidebarService.sidebarLayerShowHide.next(true);
    }

    // ngOnDestroy() {
    // this.setLocalStorageData(); Removed because on some layers the system was crashing. Need to fix this.
    // }

    ngAfterViewInit() {
        this.setMap();
        this.setControls();
        // this.getLocalStorageData(); Removed because on some layers the system was crashing. Need to fix this.
        this.setBaseLayers();
        this.setOverlayEvents();
        this.authService.user.subscribe(user => {
            if (user) {
                this.mapService.reportTableButton.next(true);
            } else {
                this.mapService.reportTableButton.next(false);
            }
        });
    }

    setMap() {
        this.map = L.map('map', {maxZoom: this.mapConfig.maxZoom});
        L.Handler.toString();
        this.panMap(this.mapConfig.initialLatLong, this.mapConfig.initialZoom);
        L.Marker.prototype.options.icon = L.icon({
            iconRetinaUrl: 'assets/marker-icon-2x.png',
            iconUrl: 'assets/marker-icon.png',
            shadowUrl: 'assets/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41]
        });
    }

    setControls() {
        this.setLayerControl();
        this.setSearchControl();
        this.setFullScreenControl();
        this.setDrawControl();
        this.setLegendControl();
        this.setCoordinatesControl();
        this.setScaleControl();
        this.setTableControl();
        this.setReportTableControl();
        this.setInfoControl();
        this.setRestoreMapControl();
        // this.setVisibleLayersControl();
        this.setMarkersGroup();
    }

    // getLocalStorageData() {
    //     if (sessionStorage.getItem('mapState')) {
    //         const mapState: MapState = JSON.parse(sessionStorage.getItem('mapState'));
    //         this.selectedBaseLayer = mapState.selectedBaseLayer;
    //         const previousSelectedLayers: Layer[] = mapState.selectedLayers;
    //         const previousLatLong = mapState.mapLatLong;
    //         const previousZoom = mapState.mapZoom;
    //         this.selectedMarker = mapState.selectedMaker;
    //
    //         if (previousSelectedLayers && previousSelectedLayers.length > 0) {
    //             previousSelectedLayers.forEach((layer: Layer) => {
    //                 this.addLayer(layer, true);
    //                 if (layer.markerSelected) {
    //                     this.selectedPrimaryLayer = layer;
    //                     this.updateMarkers(layer);
    //                 }
    //             });
    //         } else {
    //             if (this.selectedMarker) {
    //                 const marker = this.createMarker(this.selectedMarker.title,
    //                     this.selectedMarker.latLong,
    //                     this.selectedMarker.overlayName,
    //                     this.selectedMarker.link
    //                 );
    //                 this.markerClusterGroup.addLayer(marker);
    //                 this.markerClusterGroup.addTo(this.map);
    //                 marker.fire('click');
    //             }
    //         }
    //         this.panMap(previousLatLong, previousZoom);
    //     }
    //     sessionStorage.removeItem('mapState');
    // }

    // setLocalStorageData() {
    //     if (this.selectedLayers) {
    //         const mapState = new MapState(
    //             this.selectedLayers,
    //             this.selectedMarker,
    //             this.map.getZoom(),
    //             [
    //                 this.map.getCenter().lat,
    //                 this.map.getCenter().lng
    //             ],
    //             this.tableReportActive,
    //             this.selectedBaseLayer
    //         );
    //         sessionStorage.setItem('mapState', JSON.stringify(mapState));
    //     }
    // }

    setBaseLayers() {
        this.mapConfig.baselayers.forEach(baseLayerData => {
            const baseLayer = this.getLayer(baseLayerData);
            const baseLayerName = baseLayerData.name;
            this.layerControl.addBaseLayer(baseLayer, baseLayerName);
            if (environment.production) {
                if ((!this.selectedBaseLayer && baseLayerData.default) || (this.selectedBaseLayer === baseLayerName)) {
                    baseLayer.addTo(this.map);
                    this.selectedBaseLayer = baseLayerName;
                }
            } else if (baseLayerName === 'osm') {
                baseLayer.addTo(this.map);
            }
        });
        this.map.on('baselayerchange', layer => {
            this.selectedBaseLayer = layer['name'];
        });
    }

    async setMarkers(data, carRegister, layer, columnCarGid) {
        this.clearMarkerInfo();

        this.layerControl.removeLayer(this.markerClusterGroup);

        data.forEach(markerData => {
            const popupTitle = markerData[carRegister.estadual] ? markerData[carRegister.estadual] : markerData[carRegister.federal];
            const layerLabel = 'Descrição do CAR';
            const codGroup = layer.codgroup;
            const marker = this.createMarker(popupTitle, [markerData.lat, markerData.long], layerLabel, markerData[columnCarGid], codGroup, layer);

            if (marker) {
                this.markerClusterGroup.addLayer(marker);
            }
        });

        this.searchControl.setLayer(this.markerClusterGroup);
        this.searchControl.options.layer = this.markerClusterGroup;

        const bounds = this.markerClusterGroup.getBounds();

        if (bounds && this.zoomIn) {
            this.map.fitBounds(bounds);
        }
    }

    createMarker(title, latLong, layerLabel, gid, codGroup, layer?) {
        const marker = L.marker(latLong, {title});
        this.linkPopupService.register(marker, layerLabel, gid, codGroup, layer);
        return marker;
    }

    setMarkersGroup() {
        this.markerClusterGroup = L.markerClusterGroup({chunkedLoading: true, spiderfyOnMaxZoom: true});
        this.map.addLayer(this.markerClusterGroup);
    }

    setOpacity(layer: Layer, value: number) {
        this.mapService.setOpacity(layer, value, this.map);
    }

    setExtent(layer: Layer) {
        this.mapService.setExtent(layer, this.map);
    }

    clearMap() {
        this.clearLayers();
        this.markerClusterGroup.clearLayers();
        this.selectedLayers = [];
    }

    setTableMarker(markerData) {
        this.markerClusterGroup.clearLayers();

        let propertyData = markerData.data;
        const layer: Layer = markerData.layer;
        const codGroup = layer['codgroup'];

        if (!Array.isArray(propertyData)) {
            propertyData = [propertyData];
        }

        const propertyCount = propertyData.length;

        let latLong = null;

        for (const data of propertyData) {
            latLong = [data.lat, data.long];

            let carRegister = '';

            let layerLabel = '';

            layerLabel = 'Descrição do CAR';
            carRegister = data.gid;

            const cqlFilter = ` gid = ${data.gid} `;

            const layerData = {
                url: `${environment.geoserverUrl}/wms`,
                layers: 'terrama2_119:view119',
                transparent: true,
                format: 'image/png',
                version: '1.1.0',
                cql_filter: cqlFilter
            };
            const newLayer = this.getLayer(layerData);

            newLayer.addTo(this.map);

            this.tableSelectedLayer = newLayer;

            if (propertyCount === 1) {
                this.clearMarkerInfo();
            }

            this.markerInfo = this.createMarker(carRegister, latLong, layerLabel, carRegister, codGroup, layer);

            this.markerClusterGroup.addLayer(this.markerInfo);
        }

        this.markerClusterGroup.addTo(this.map);
        if (propertyCount === 1) {
            this.panMap(latLong, 13);
            this.markerInfo.fire('click');
        }
        this.searchControl.setLayer(this.markerClusterGroup);
        this.searchControl.options.layer = this.markerClusterGroup;
    }

    setOverlayEvents() {
        this.mapService.layerOpactity.subscribe((layerObject) => {
            this.setOpacity(layerObject['layer'], layerObject['value']);
        });

        this.mapService.layerExtent.subscribe(layer => {
            this.mapService.setExtent(layer, this.map);
        });

        this.mapService.layerToolOpen.subscribe((toolClicked) => {
            this.displayLayerTools = true;
            this.layerTool = toolClicked['layer'];
            this.toolSelected = toolClicked['toolName'];
        });

        this.mapService.layerToolClose.subscribe((layer: Layer) => {
            if (this.layerTool && layer.value === this.layerTool.value) {
                this.displayLayerTools = false;
                this.layerTool = null;
                this.toolSelected = null;
            }
        });

        this.mapService.legendClose.subscribe(() => {
            this.displayLegend = false;
        });

        this.mapService.showMarker.subscribe(markerData => {
            const heightSmall = this.tableConfig.heightSmall;
            const panelHeightSmall = this.tableConfig.panelHeightSmall;
            this.tableHeight = heightSmall;
            this.tablePanelHeight = panelHeightSmall;

            this.setTableMarker(markerData);
        });

        this.mapService.reportTable.subscribe(() => {
            this.displayTable = true;
            this.tableReportActive = true;
        });

        this.mapService.clearMap.subscribe(() => this.clearMap());

        this.filterService.filterMap.subscribe((zoomIn: boolean) => {
            this.zoomIn = zoomIn;
            this.clearLayers();
            this.updateLayers();
        });

        this.sidebarService.sidebarLayerSelect.subscribe((itemSelected: Layer) => {
            this.clearMarkerInfo();
            this.addLayer(itemSelected, true);
        });

        this.sidebarService.sidebarLayerDeselect.subscribe((itemDeselected: Layer) => {
            this.clearMarkerInfo();
            if (this.selectedPrimaryLayer && this.selectedPrimaryLayer.value === itemDeselected.value) {
                this.markerClusterGroup.clearLayers();
            }
            this.removeLayer(itemDeselected, true);
        });

        this.sidebarService.sidebarLayerGroupSelect.subscribe((itemSelected: LayerGroup) => {
            this.clearMarkerInfo();
            const layers = itemSelected.children;
            this.sidebarService.sidebarLayerSwitchSelect.next(layers);
            layers.forEach((layer: Layer) => {
                if (!layer.isDisabled && !layer.isHidden) {
                    const layerExists = this.selectedLayers.find(selectedLayer => selectedLayer.value === layer.value);
                    if (!layerExists) {
                        this.addLayer(layer, true);
                    }
                }
            });
        });

        this.sidebarService.sidebarLayerGroupDeselect.subscribe((itemDeselected: LayerGroup) => {
            this.clearMarkerInfo();
            const layers = itemDeselected.children;
            this.sidebarService.sidebarLayerSwitchDeselect.next(layers);
            layers.forEach((layer: Layer) => {
                this.removeLayer(layer, true);
                this.tableService.unloadTableData.next(layer);
            });
        });

        this.sidebarService.sidebarItemRadioSelect.subscribe((layer: Layer) => {
            this.selectedPrimaryLayer = layer;
            this.zoomIn = false;
            this.clearMarkerInfo();
            layer.markerSelected = true;
            this.updateMarkers(layer);
        });

        this.sidebarService.sidebarItemRadioDeselect.subscribe((layer: Layer) => {
            if (this.selectedPrimaryLayer && this.selectedPrimaryLayer.value === layer.value) {
                this.selectedPrimaryLayer = null;
            }
            layer.markerSelected = false;
            this.clearMarkerInfo();
        });

        this.mapService.clearMarkers.subscribe(() => {
            this.markerClusterGroup.clearLayers();
        });

        this.mapService.resetLayers.subscribe(items => {
            const draggedItemFrom = items[0].item;
            const draggedItemFromIndex = items[0].index;

            const draggedItemTo = items[1].item;
            const draggedItemToIndex = items[1].index;

            this.map.eachLayer((layer: L.TileLayer.WMS) => {
                if (layer.options.layers === draggedItemFrom.layerData.layers) {
                    layer.setZIndex(draggedItemToIndex);
                }
                if (layer.options.layers === draggedItemTo.layerData.layers) {
                    layer.setZIndex(draggedItemFromIndex);
                }
            });
        });
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
                return (layer.isPrimary) ? ` de_car_validado_sema_numero_do1 = '${value}' ` : ` ${layer.tableOwner}_de_car_validado_sema_numero_do1 = '${value}' `;
            },
            car_federal(value) {
                return (layer.isPrimary) ? ` de_car_validado_sema_numero_do2 = '${value}' ` : ` ${layer.tableOwner}_de_car_validado_sema_numero_do2 = '${value}' `;
            },
            cpf(value) {
                const newValue = value ? value.replace(/\D/g, '') : '';
                return (layer.isPrimary) ? ` de_car_validado_sema_cpfcnpj like '%${newValue}%' ` : ` ${layer.tableOwner}_de_car_validado_sema_cpfcnpj = '%${newValue}%'`;
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
                    cqlFilter += ` calculated_area_ha ${values.columnValue} `;
                }

                if ((analyze.type && analyze.type === 'deforestation') && (layer.codgroup === 'PRODES') && (layer.cod === 'CAR_X_PRODES')) {
                    cqlFilter += cqlFilter ? ' and ' : '';
                    cqlFilter += ` calculated_area_ha ${values.columnValue} `;
                }

                if ((analyze.type && analyze.type === 'burned') && (layer.codgroup === 'BURNED') && (layer.cod === 'CAR_X_FOCOS')) {
                    cqlFilter += cqlFilter ? ' and ' : '';
                    cqlFilter += ` num_car_focos ${values.columnValueFocos} `;
                }

                if ((analyze.type && analyze.type === 'burned_area') && (layer.codgroup === 'BURNED_AREA') && (layer.cod === 'CAR_X_AREA_Q')) {
                    cqlFilter += cqlFilter ? ' and ' : '';
                    cqlFilter += ` calculated_area_ha ${values.columnValue} `;
                }

                if ((analyze.type && analyze.type === 'car_area')) {
                    cqlFilter += cqlFilter ? ' and ' : '';
                    cqlFilter += ` ${layer.filter.car.field} ${values.columnValue} `;
                }
            }
        });

        if (cqlFilter) {
            layer.layerData.cql_filter = cqlFilter;
        }

        return layer;
    }

    getValues(analyze) {
        const values = {columnValue: '', columnValueFocos: '', min: null, max: null};
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
                    values.columnValue = ` > ${analyze.valueOptionBiggerThen} `;
                    values.columnValueFocos = ` > ${analyze.valueOptionBiggerThen} `;
                    values.min = analyze.valueOptionBiggerThen;
                    values.max = 9999999999;
                    break;
            }
        }
        return values;
    }

    setCqlFilter(layer) {
        const filter = JSON.parse(localStorage.getItem('filterList'));

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

    setFilter(layer) {
        if (layer.type !== LayerType.ANALYSIS && layer.type !== LayerType.DYNAMIC) {
            return layer;
        }

        const currentDateInput = JSON.parse(localStorage.getItem('dateFilter'));

        if (layer.cod === 'CAR_X_FOCOS') {
            layer.layerData.viewparams = `date1:${currentDateInput[0].substring(0, 10)};date2:${currentDateInput[1].substring(0, 10)}`;
        } else {
            layer.layerData.time = `${currentDateInput[0]}/${currentDateInput[1]}`;
        }

        if (layer.type === LayerType.DYNAMIC) {
            return layer;
        }

        layer = this.setCqlFilter(layer);

        return layer;
    }

    addLayer(layer, addLayer) {
        let layerToAdd = null;
        if (layer && layer.layerData) {
            const hasLayer = this.selectedLayers.some(selectedLayer => selectedLayer.value === layer.value);
            if (addLayer && !hasLayer) {
                this.selectedLayers.push(layer);
            }
            // layer.layerData.viewparams.delete;
            layer = this.setFilter(layer);
            layerToAdd = this.getLayer(layer.layerData);
            layerToAdd.on('loading', () => this.isLoading = true);
            layerToAdd.on('load', () => this.isLoading = false);
            layerToAdd.on('tileunload', () => {
                if (this.selectedLayers.length === 0) {
                    this.isLoading = false;
                }
            });
            layerToAdd.on('tileerror', () => this.isLoading = false);
            layerToAdd.setZIndex(1000 + this.selectedLayers.length);
            layerToAdd.addTo(this.map);
            layer.leafletId = layerToAdd._leaflet_id;
        }
        return layerToAdd;
    }

    removeLayer(layer, deselectLayer) {
        if (layer) {
            if (deselectLayer) {
                this.selectedLayers.splice(this.selectedLayers.findIndex(selectedLayer => selectedLayer.value === layer.value), 1);
            }
            if (layer instanceof L.TileLayer.WMS) {
                layer.removeFrom(this.map);
                return;
            }
            const layerData = layer.layerData;
            let zindex = 0;
            if (!layerData) {
                return;
            }
            this.map.eachLayer((mapLayer: L.TileLayer.WMS) => {

                if (mapLayer.options.layers === layerData.layers) {
                    zindex = mapLayer.options.zIndex;
                    mapLayer.removeFrom(this.map);
                }

                if (mapLayer.options.zIndex > zindex) {
                    mapLayer.setZIndex((mapLayer.options.zIndex - 1));
                }

            });
        }
    }

    getLayer(layerData) {
        layerData.crs = L.CRS.EPSG4326;
        return L.tileLayer.wms(layerData.url, layerData);
    }

    panMap(latlng, zoom) {
        this.map.setView(latlng, zoom);
    }

    setLayerControl() {
        this.layerControl = L.control.layers(
            {}, {},
            this.mapConfig.controls.layers
        ).addTo(this.map);
    }

    setFullScreenControl() {
        this.map.addControl(L.control.fullscreen(this.mapConfig.controls.fullscreen));
    }

    setScaleControl() {
        this.map.addControl(L.control.scale(this.mapConfig.controls.scale));
    }

    setLegendControl() {
        const Legend = L.Control.extend({
            onAdd: () => {
                const div = L.DomUtil.create('div');
                div.innerHTML = `
          <div id="legendBtn" class="leaflet-control-layers leaflet-custom-icon leaflet-legend" title="Legendas">
            <a><i class='fas fa-th-list'></i></a>
          </div>`;
                return div;
            }
        });

        new Legend({position: 'topleft'}).addTo(this.map);

        this.setLegendControlEvent();
    }

    setLegendControlEvent() {
        L.DomEvent.on(L.DomUtil.get('legendBtn'), 'click dblclick', L.DomEvent.stopPropagation);
        document.querySelector('#legendBtn').addEventListener('click', () => this.displayLegend = !this.displayLegend);
    }

    setTableControl() {
        const Table = L.Control.extend({
            onAdd: () => {
                const div = L.DomUtil.create('div');
                div.innerHTML = `
          <div id="tableBtn" class="leaflet-control-layers leaflet-custom-icon" title="Tabela">
            <a><i class='fas fa-table'></i></a>
          </div>`;
                return div;
            }
        });

        new Table({position: 'topleft'}).addTo(this.map);

        this.setTableControlEvent();
    }

    setTableControlEvent() {
        L.DomEvent.on(L.DomUtil.get('tableBtn'), 'click dblclick', L.DomEvent.stopPropagation);
        document.querySelector('#tableBtn').addEventListener('click', () => {
            this.displayTable = true;
            this.clearReportTable();
        });
    }

    setReportTableControl() {
        this.mapService.reportTableButton.subscribe(isAuthenticated => {
            if (isAuthenticated) {
                if (!this.reportTable) {
                    const ReportTable = L.Control.extend({
                        onAdd: () => {
                            const div = L.DomUtil.create('div');
                            div.innerHTML = `
                <div id="reportTableBtn" class="leaflet-control-layers leaflet-custom-icon leaflet-report-table-icon" title="Relatórios">
                  <a><i class='fas fa-file-alt'></i> Relatórios</a>
                </div>`;
                            return div;
                        }
                    });
                    this.reportTable = new ReportTable({position: 'topright'});
                    this.reportTable.addTo(this.map);
                    this.setReportTableControlEvent();
                }
            } else {
                this.removeReportButton();
            }
        });
    }

    setReportTableControlEvent() {
        L.DomEvent.on(L.DomUtil.get('reportTableBtn'), 'click dblclick', L.DomEvent.stopPropagation);
        document.querySelector('#reportTableBtn').addEventListener('click', () => {
            this.tableService.clearTable.next();
            this.displayTable = true;
            this.tableReportActive = true;
            this.tableService.loadReportTableData.next();
        });
    }

    removeReportButton() {
        this.displayTable = false;
        this.clearReportTable();
        if (this.reportTable) {
            this.map.removeControl(this.reportTable);
        }
        this.reportTable = null;
    }

    setSearchControl() {
        const searchOptions = this.mapConfig.controls.search;
        searchOptions.moveToLocation = latlng => {
            this.markerClusterGroup.eachLayer((marker: L.Marker) => {
                if (marker.getLatLng().equals(latlng)) {
                    this.panMap(latlng, 18);
                    marker.fire('click');
                }
            });
        };
        searchOptions.marker = L.circleMarker([0, 0], this.mapConfig.controls.search.marker);
        this.searchControl = new Search(searchOptions);
        this.map.addControl(this.searchControl);
    }

    setCoordinatesControl() {
        const Coordinates = L.Control.extend({
            onAdd: map => {
                const container = L.DomUtil.create('div');
                map.addEventListener('mousemove', e => {
                    container.innerHTML = `
          <div id="coordinates" class="leaflet-control-coordinates leaflet-control-layers leaflet-latlong-icon">
          <strong>Lat:</strong>
          ${e.latlng.lat.toFixed(4)}
          &nbsp;
          <strong>Long:</strong>
          ${e.latlng.lng.toFixed(4)}
          </div>
          `;
                });
                L.DomEvent.disableClickPropagation(container);
                return container;
            }
        });
        new Coordinates({
            position: 'bottomright'
        }).addTo(this.map);
    }

    setDrawControl() {
        const editableLayers = new L.FeatureGroup();

        const drawOptions = this.mapConfig.controls.draw;
        drawOptions.edit.featureGroup = editableLayers;
        const drawControl = new L.Control.Draw(drawOptions);
        this.map.addControl(drawControl);

        this.map.on(L.Draw.Event.CREATED, e => {
            const layer = e['layer'];
            if (layer) {
                editableLayers.addLayer(layer);
            }
        });

        this.map.addLayer(editableLayers);
    }

    setInfoControl() {
        const Info = L.Control.extend({
            onAdd: () => {
                const div = L.DomUtil.create('div');
                div.innerHTML = `
          <div id="infoBtn" class="leaflet-control-layers leaflet-custom-icon leaflet-info" title="Informação">
            <a><i class='fas fa-info'></i></a>
          </div>`;
                return div;
            }
        });

        new Info({position: 'topleft'}).addTo(this.map);

        this.setInfoControlEvent();
    }

    setInfoControlEvent() {
        L.DomEvent.on(L.DomUtil.get('infoBtn'), 'dblclick click', L.DomEvent.stopPropagation);
        document.querySelector('#infoBtn').addEventListener('click', () => {
            if (this.displayInfo === false) {
                this.displayInfo = true;
                document.querySelector('#infoBtn').classList.add('leaflet-custom-icon-selected');
                document.querySelector('#map').classList.remove('cursor-grab');
                document.querySelector('#map').classList.add('cursor-help');
                this.map.on('click', (event: L.LeafletMouseEvent) => this.getFeatureInfo(event));
            } else {
                if (this.markerInfo) {
                    this.markerInfo.remove();
                }
                this.displayInfo = false;
                document.querySelector('#infoBtn').classList.remove('leaflet-custom-icon-selected');
                document.querySelector('#map').classList.remove('cursor-help');
                document.querySelector('#map').classList.add('cursor-grab');
                this.map.off('click');
            }
        });
    }

    async getFeatureInfo(event: L.LeafletMouseEvent) {
        const latLong = event.latlng;
        let popupContent = `<div class="popup-container-feature-info">`;

        if (this.selectedLayers.length === 0) {
            popupContent += `<h2>Layer não encontrado.</h2>`;
        }

        const infoColumns = await this.configService.getInfoColumns().then((response: Response) => response);

        let popupTable = '';
        for (const selectedLayer of this.selectedLayers) {
            const layerInfoColumn = infoColumns[selectedLayer.codgroup];
            const layer = this.getLayer(selectedLayer.layerData);
            const layerName = selectedLayer.label;

            let params = null;
            let url = '';
            if (selectedLayer.type === LayerType.ANALYSIS || selectedLayer.type === LayerType.DYNAMIC) {
                url = `${environment.geoserverUrl}/wfs`;
                params = this.getWFSFeatureInfoParams(layer, event, selectedLayer.type, selectedLayer.cod);
            } else {
                url = `${environment.geoserverUrl}/wms`;
                params = this.getWMSFeatureInfoParams(layer, event);
            }

            await this.hTTPService.get(url, params).toPromise().then((layerInfo: LayerInfo) => {
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

        this.clearMarkerInfo();

        this.markerInfo = L.marker(latLong, {});
        this.markerInfo.bindPopup(popupContent, {maxWidth: 500, maxHeight: 500});
        this.markerInfo.addTo(this.map);
        this.markerInfo.openPopup();
    }

    getWMSFeatureInfoParams(layer: L.TileLayer.WMS, event: L.LeafletMouseEvent) {
        const layerPoint = this.map.layerPointToContainerPoint(event.layerPoint);
        const bbox = this.map.getBounds().toBBoxString();
        const mapSize = this.map.getSize();
        const width = mapSize.x;
        const height = mapSize.y;
        const x = Math.round(layerPoint.x);
        const y = Math.round(layerPoint.y);
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

    getWFSFeatureInfoParams(layer: L.TileLayer.WMS, event, layerType, layerCod) {
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
            cql_filter: `INTERSECTS(${geomColumn}, POINT(${event.latlng.lat} ${event.latlng.lng}))`
        };
    }

    getFeatureInfoPopup(layerName: string, features: LayerInfoFeature[], infoColumns = null) {
        let popupContent = '';
        if (features) {
            features.forEach(feature => {
                const properties = feature.properties;
                if (properties) {
                    popupContent += this.mapService.getPopupContent(properties, layerName, infoColumns);
                }
            });
        }
        return popupContent;
    }

    setRestoreMapControl() {
        const RestoreMap = L.Control.extend({
            onAdd: () => {
                const div = L.DomUtil.create('div');
                div.innerHTML = `
                  <div id="restoreMapBtn" class="leaflet-control-layers leaflet-custom-icon leaflet-restore-map" title="Restaurar mapa">
                    <a><i class='fas fa-crosshairs'></i></a>
                  </div>`;
                return div;
            }
        });

        new RestoreMap({position: 'topleft'}).addTo(this.map);

        this.setRestoreMapControlEvent();
    }

    setRestoreMapControlEvent() {
        const initialLatLong = this.mapConfig.initialLatLong;
        const initialZoom = this.mapConfig.initialZoom;
        L.DomEvent.on(L.DomUtil.get('restoreMapBtn'), 'click dblclick', L.DomEvent.stopPropagation);
        document.querySelector('#restoreMapBtn')
            .addEventListener('click', () => this.panMap(initialLatLong, initialZoom));
    }

    // setVisibleLayersControl() {
    //   const VisibleLayers = L.Control.extend({
    //     onAdd: () => {
    //       const div = L.DomUtil.create('div');
    //       div.innerHTML = `
    //         <div id="visibleLayersBtn" class="leaflet-control-layers leaflet-custom-icon" title="Layers visíveis">
    //           <a><i class='fas fa-list'></i></a>
    //         </div>`;
    //       return div;
    //     }
    //   });
    //
    //   new VisibleLayers({position: 'topleft' }).addTo(this.map);
    //
    //   this.setVisibleLayersControlEvent();
    // }
    //
    // setVisibleLayersControlEvent() {
    //   document.querySelector('#visibleLayersBtn')
    //           .addEventListener('click', () => {
    //             this.displayVisibleLayers = !this.displayVisibleLayers;
    //             L.DomEvent.on(L.DomUtil.get('visibleLayersBtn'), 'dblclick', L.DomEvent.stopPropagation);
    //   });
    // }

    // Events
    onShowTable() {
        this.displayTable = true;
    }

    onHideTable() {
        this.displayTable = false;
    }

    clearLayers() {
        this.selectedLayers.forEach(layer => this.removeLayer(layer, false));
    }

    updateLayers() {
        this.selectedLayers.forEach(layer => {
            if (layer.markerSelected) {
                this.updateMarkers(layer);
            }

            this.addLayer(layer, false);
        });
    }

    clearReportTable() {
        if (this.tableReportActive) {
            this.tableService.clearTable.next();
            this.tableReportActive = false;
            this.tableSelectedLayer = null;
        }
    }

    clearMarkerInfo() {
        if (this.markerInfo) {
            this.markerInfo.removeFrom(this.map);
            this.markerInfo = null;
        }
    }

    expandShrinkTable() {
        const panelHeightSmall = this.tableConfig.panelHeightSmall;

        const height = this.tableConfig.height;
        const panelHeight = this.tableConfig.panelHeight;

        const heightBig = this.tableConfig.heightBig;
        const panelHeightBig = this.tableConfig.panelHeightBig;
        if (this.tablePanelHeight === panelHeight) {
            this.tablePanelHeight = panelHeightBig;
            this.tableHeight = heightBig;
            this.tableFullscreen = true;
        } else if (this.tablePanelHeight === panelHeightBig) {
            this.tablePanelHeight = panelHeight;
            this.tableHeight = height;
            this.tableFullscreen = false;
        } else if (this.tablePanelHeight === panelHeightSmall) {
            this.tablePanelHeight = panelHeight;
            this.tableHeight = height;
            this.tableFullscreen = false;
        }
    }

    private updateMarkers(layer: Layer) {
        this.markerClusterGroup.clearLayers();

        const url = this.configService.getAppConfig('layerUrls')[layer.type]['markers'];

        const view = JSON.stringify(
            new View(
                layer.value,
                layer.cod,
                layer.codgroup,
                (layer.type === LayerType.ANALYSIS),
                layer.isPrimary,
                layer.tableOwner,
                layer.tableName
            ));

        const params = this.filterService.getParams({view});

        const columnCarGid = layer.type === LayerType.ANALYSIS ? 'de_car_validado_sema_gid' : 'gid';
        const carRegisterColumn = {
            federal: layer.type === LayerType.ANALYSIS ? 'de_car_validado_sema_numero_do2' : 'numero_do2',
            estadual: layer.type === LayerType.ANALYSIS ? 'de_car_validado_sema_numero_do1' : 'numero_do1'
        };
        this.hTTPService.get(url, params)
            .subscribe(data => this.setMarkers(data, carRegisterColumn, layer, columnCarGid));
    }
}
