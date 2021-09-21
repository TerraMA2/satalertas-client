import { AfterViewInit, Component, OnInit } from '@angular/core';

import * as L from 'leaflet';

import 'leaflet.markercluster';

import 'leaflet.fullscreen';

import 'leaflet-draw';

import 'leaflet-control-boxzoom';

import { HTTPService } from '../../services/http.service';

import { ConfigService } from '../../services/config.service';

import { SidebarService } from 'src/app/services/sidebar.service';

import { MapService } from 'src/app/services/map.service';

import { LayerType } from 'src/app/enum/layer-type.enum';

import { Layer } from 'src/app/models/layer.model';

import { LayerGroup } from 'src/app/models/layer-group.model';

import { FilterService } from '../../services/filter.service';

import { TableService } from 'src/app/services/table.service';

import { View } from '../../models/view.model';

import { environment } from 'src/environments/environment';

import { PopupService } from '../../services/popup.service';

import { Response } from '../../models/response.model';

import { SearchService } from '../../services/search.service';

import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit, AfterViewInit {
	selectedLayers: Layer[] = [];
	layerTool: Layer;
	toolSelected: string;
	markerClusterGroup: L.MarkerClusterGroup;
	selectedPrimaryLayer: Layer;
	markerInfo: L.Marker;
	tableSelectedLayer: L.TileLayer.WMS;
	displayTable = false;
	displayLegend = false;
	displayVisibleLayers = false;
	displayLayerTools = false;
	displaySearch = false;
	selectedBaseLayer: string;
	isLoading = false;
	speedDialItems = [];
	private map: L.Map;
	private mapConfig;
	private tableConfig;
	private zoomIn = false;
	private layerControl: L.Control.Layers;
	isMobile = false;
	constructor(
		private hTTPService: HTTPService,
		private configService: ConfigService,
		private sidebarService: SidebarService,
		private tableService: TableService,
		private mapService: MapService,
		private filterService: FilterService,
		private popupService: PopupService,
		private searchService: SearchService,
		private deviceDetectorService: DeviceDetectorService
	) {
	}

	ngOnInit() {
		this.isMobile = this.deviceDetectorService.isMobile();
		this.mapConfig = this.configService.getMapConfig();
		this.tableConfig = this.configService.getMapConfig('table');
		this.sidebarService.sidebarLayerShowHide.next(true);
		this.sidebarService.sidebarReload.next();
		this.setSpeedDial();
	}

	async ngAfterViewInit() {
		this.setMap();
		this.setControls();
		this.setBaseLayers();
		this.setEvents();
	}

	setMap() {
		const state = this.configService.getAppConfig('state');
		const initialLatLong = this.configService.getCoordsJson(state);
		this.map = this.mapService.getMap(this.mapConfig.maxZoom);
		this.mapService.panMap(this.map, initialLatLong, this.mapConfig.initialZoom);
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
		this.setFullScreenControl();
		this.setDrawControl();
		this.setSearchControl();
		if (!this.isMobile) {
			this.setLegendControl();
			this.setTableControl();
			this.setVisibleLayersControl();
		}
		this.setCoordinatesControl();
		this.setScaleControl();
		this.setInfoControl();
		this.setRestoreMapControl();
		this.setZoomBoxControl();
		this.setMarkersGroup();
	}

	setBaseLayers() {
		const baseLayers = this.mapConfig.baselayers;
		if (!baseLayers) {
			return;
		}
		baseLayers.forEach(baseLayerData => {
			const baseLayer = this.mapService.getLayer(baseLayerData);
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
		this.map.on('baselayerchange', layer => this.selectedBaseLayer = layer['name']);
	}

	setMarkersGroup() {
		this.markerClusterGroup = this.mapService.getMarkersGroup();
		this.map.addLayer(this.markerClusterGroup);
	}

	async setMarkers(data, carRegister, layer, columnCarGid) {
		this.layerControl.removeLayer(this.markerClusterGroup);

		data.forEach(markerData => {
			const popupTitle = markerData[carRegister.estadual] ? markerData[carRegister.estadual] : markerData[carRegister.federal];
			const layerLabel = 'Descrição do CAR';
			const groupCode = layer.groupCode;
			const marker = this.createMarker(popupTitle, [markerData.lat, markerData.long], layerLabel, markerData[columnCarGid], groupCode, layer);

			if (marker) {
				this.markerClusterGroup.addLayer(marker);
			}
		});

		const bounds = this.markerClusterGroup.getBounds();

		if (bounds && this.zoomIn) {
			this.map.fitBounds(bounds);
		}
	}

	updateLayers() {
		this.selectedLayers.forEach(layer => {
			if (this.selectedPrimaryLayer) {
				this.updateMarkers(layer);
			}
			this.addLayer(layer, false);
		});
	}

	setLayerControl() {
		this.layerControl = this.mapService.getLayerControl(this.mapConfig.controls.layers).addTo(this.map);
	}

	setFullScreenControl() {
		this.map.addControl(this.mapService.getFullScreenControl(this.mapConfig.controls.fullscreen));
	}

	setScaleControl() {
		this.map.addControl(this.mapService.getScaleControl(this.mapConfig.controls.scale));
	}

	setLegendControl() {
		const Legend = this.mapService.getLegendControl();
		new Legend({ position: 'topleft' }).addTo(this.map);
		this.setLegendControlEvent();
	}

	setLegendControlEvent() {
		L.DomEvent.on(L.DomUtil.get('legendBtn'), 'click dblclick', L.DomEvent.stopPropagation);
		document.querySelector('#legendBtn').addEventListener('click', () => {
			if (this.isMobile) {
				this.sidebarService.sidebarShowHide.next(false);
			}
			this.displayLegend = !this.displayLegend;
		});
	}

	setTableControl() {
		const Table = this.mapService.getTableControl();
		new Table({ position: 'topleft' }).addTo(this.map);
		this.setTableControlEvent();
	}

	setTableControlEvent() {
		L.DomEvent.on(L.DomUtil.get('tableBtn'), 'click dblclick', L.DomEvent.stopPropagation);
		document.querySelector('#tableBtn').addEventListener('click', () => {
			if (this.isMobile) {
				this.sidebarService.sidebarShowHide.next(false);
			}
			this.displayTable = true;
		});
	}

	setSearchControl() {
		const Search = this.mapService.getSearchControl();
		new Search({ position: 'topleft' }).addTo(this.map);
		this.setSearchControlEvent();
	}

	setSearchControlEvent() {
		L.DomEvent.on(L.DomUtil.get('searchBtn'), 'click dblclick', L.DomEvent.stopPropagation);
		document.querySelector('#searchBtn').addEventListener('click', () => {
			if (this.isMobile) {
				this.sidebarService.sidebarShowHide.next(false);
			}
			this.displaySearch = true;
		});
	}

	setCoordinatesControl() {
		const Coordinates = this.mapService.getCoordinatesControl();
		new Coordinates({position: 'bottomright'}).addTo(this.map);
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

	setZoomBoxControl() {
		const zoomBoxOptions = this.mapConfig.controls.zoomBox;
		if (!zoomBoxOptions) {
			return;
		}
		L.Control.boxzoom(zoomBoxOptions);
	}

	setInfoControl() {
		this.setInfoControlEvent();
	}

	setSpeedDial() {
		this.speedDialItems = [
			{
				icon: 'fas fa-search',
				command: () => {
					this.displaySearch = true;
					this.sidebarService.sidebarShowHide.next(false);
				}
			},
			{
				icon: 'fas fa-table',
				command: () => {
					this.displayTable = true;
					this.sidebarService.sidebarShowHide.next(false);
				}
			},
			{
				icon: 'fas fa-th-list',
				command: () => {
					this.displayLegend = true;
					this.sidebarService.sidebarShowHide.next(false);
				}
			},
			{
				icon: 'fas fa-list',
				command: () => {
					this.displayVisibleLayers = true;
					this.sidebarService.sidebarShowHide.next(false);
				}
			},
			{
				icon: 'fas fa-filter',
				command: () => {
					this.filterService.displayFilter.next();
					this.sidebarService.sidebarShowHide.next(false);
				}
			}
		];
	}

	setInfoControlEvent() {
		this.map.on('contextmenu', (event: L.LeafletMouseEvent) => this.getFeatureInfo(event))
	}

	createMarker(title, latLong, layerLabel, gid, groupCode, layer?) {
		const marker = L.marker(latLong, { title });
		this.popupService.register(marker, layerLabel, gid, groupCode, layer);
		return marker;
	}

	clearMarkerInfo() {
		if (this.markerInfo) {
			this.markerInfo.removeFrom(this.map);
			this.markerInfo = null;
		}
	}

	async getFeatureInfo(event: L.LeafletMouseEvent) {
		const latLong = event.latlng;
		const layerPoint = event.layerPoint;
		this.clearMarkerInfo();
		this.markerInfo = L.marker(latLong, {});
		this.markerInfo.on('popupclose', () => this.clearMarkerInfo());
		await this.mapService.getFeatureInfo(this.selectedLayers, this.map, latLong, layerPoint, this.markerInfo);
	}

	setRestoreMapControl() {
		const RestoreMap = this.mapService.getRestoreMapControl();
		new RestoreMap({ position: 'topleft' }).addTo(this.map);
		this.setRestoreMapControlEvent();
	}

	setRestoreMapControlEvent() {
		const state = this.configService.getAppConfig('state');
		const initialLatLong = this.configService.getCoordsJson(state);
		const initialZoom = this.mapConfig.initialZoom;
		L.DomEvent.on(L.DomUtil.get('restoreMapBtn'), 'click dblclick', L.DomEvent.stopPropagation);
		document.querySelector('#restoreMapBtn')
		.addEventListener('click', () => this.mapService.panMap(this.map, initialLatLong, initialZoom));
	}

	setVisibleLayersControl() {
		const VisibleLayers = this.mapService.getVisibleLayersControl();
		new VisibleLayers({ position: 'topleft' }).addTo(this.map);
		this.setVisibleLayersControlEvent();
	}

	setVisibleLayersControlEvent() {
		document.querySelector('#visibleLayersBtn')
		.addEventListener('click', () => {
			if (this.isMobile) {
				this.sidebarService.sidebarShowHide.next(false);
			}
			this.displayVisibleLayers = !this.displayVisibleLayers;
			L.DomEvent.on(L.DomUtil.get('visibleLayersBtn'), 'dblclick', L.DomEvent.stopPropagation);
		});
	}

	setOpacity(layer: Layer, value: number) {
		this.mapService.setOpacity(layer, value, this.map);
	}

	clearMap() {
		this.clearLayers();
		this.markerClusterGroup.clearLayers();
		this.selectedLayers = [];
	}

	addLayer(layer, addLayer) {
		let layerToAdd = null;
		if (layer && layer.layerData) {
			const hasLayer = this.selectedLayers.some(selectedLayer => selectedLayer.viewId === layer.viewId);
			if (addLayer && !hasLayer) {
				this.selectedLayers.push(layer);
			}
			layer = this.mapService.setFilter(layer);
			layerToAdd = this.mapService.getLayer(layer.layerData);
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
				this.selectedLayers.splice(this.selectedLayers.findIndex(selectedLayer => selectedLayer.viewId === layer.viewId), 1);
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

	clearLayers() {
		this.selectedLayers.forEach(layer => this.removeLayer(layer, false));
	}

	setEvents() {
		this.mapService.searchClose.subscribe(() => this.displaySearch = false);
		this.mapService.setMapPosition.subscribe(latLng => this.mapService.panMap(this.map, latLng, 6));
		this.mapService.layerOpactity.subscribe((layerObject) => this.mapService.setOpacity(layerObject['layer'], layerObject['value'], this.map));

		this.mapService.layerExtent.subscribe(layer => this.mapService.setExtent(layer, this.map));

		this.mapService.layerToolOpen.subscribe((toolClicked) => {
			this.displayLayerTools = true;
			this.layerTool = toolClicked['layer'];
			this.toolSelected = toolClicked['toolName'];
			if (this.isMobile) {
				this.sidebarService.sidebarShowHide.next(false);
			}
		});

		this.mapService.layerToolClose.subscribe((layer: Layer) => {
			if (this.layerTool && layer.viewId === this.layerTool.viewId) {
				this.displayLayerTools = false;
				this.layerTool = null;
				this.toolSelected = null;
			}
		});

		this.mapService.legendClose.subscribe(() => this.displayLegend = false);

		this.mapService.clearMap.subscribe(() => this.clearMap());

		this.mapService.clearMarkers.subscribe(() => this.markerClusterGroup.clearLayers());

		this.mapService.resetLayers.subscribe(items => {
			const draggedItemFrom = items[0].item;
			const draggedItemFromIndex = items[0].index;

			const draggedItemTo = items[1].item;
			const draggedItemToIndex = items[1].index;

			this.selectedLayers = items[2].selectedLayers;

			this.map.eachLayer((layer: L.TileLayer.WMS) => {
				if (layer.options.layers === draggedItemFrom.layerData.layers) {
					layer.setZIndex(draggedItemToIndex);
				}
				if (layer.options.layers === draggedItemTo.layerData.layers) {
					layer.setZIndex(draggedItemFromIndex);
				}
			});
		});

		this.filterService.filterMap.subscribe((zoomIn: boolean) => {
			this.clearMarkerInfo();
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
			if (this.selectedPrimaryLayer && this.selectedPrimaryLayer.viewId === itemDeselected.viewId) {
				this.markerClusterGroup.clearLayers();
			}
			this.removeLayer(itemDeselected, true);
		});

		this.sidebarService.sidebarLayerGroupSelect.subscribe((itemSelected: LayerGroup) => {
			this.clearMarkerInfo();
			const layers = itemSelected.children;
			this.sidebarService.sidebarLayerSwitchSelect.next(layers);
			layers.filter(layer => !layer.isDisabled && !layer.isHidden)
			.forEach((layer: Layer) => {
				const layerExists = this.selectedLayers.find(selectedLayer => selectedLayer.viewId === layer.viewId);
				if (!layerExists) {
					this.addLayer(layer, true);
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
			this.updateMarkers(layer);
		});

		this.sidebarService.sidebarItemRadioDeselect.subscribe((layer: Layer) => {
			if (this.selectedPrimaryLayer && this.selectedPrimaryLayer.viewId === layer.viewId) {
				this.selectedPrimaryLayer = null;
			}
			this.clearMarkerInfo();
		});
	}

	// Events

	onShowTable() {
		this.displayTable = true;
	}

	onHideTable() {
		this.displayTable = false;
		this.tableService.clearTable.next();
		this.tableSelectedLayer = null;
	}

	private updateMarkers(layer: Layer) {
		this.markerClusterGroup.clearLayers();
		this.clearMarkerInfo();
		this.layerControl.removeLayer(this.markerClusterGroup);

		const url = this.configService.getAppConfig('layerUrls')[layer.type]['markers'];

		const view = JSON.stringify(
			new View(
				layer.viewId,
				layer.code,
				layer.groupCode,
				(layer.type === LayerType.ANALYSIS),
				layer.isPrimary,
				layer.tableOwner,
				layer.tableName
			));

		const params = this.filterService.getParams({ view });

		const columnCarGid = layer.type === LayerType.ANALYSIS ? 'de_car_validado_sema_gid' : 'gid';
		const carRegisterColumn = {
			federal: layer.type === LayerType.ANALYSIS ? 'de_car_validado_sema_numero_do2' : 'numero_do2',
			estadual: layer.type === LayerType.ANALYSIS ? 'de_car_validado_sema_numero_do1' : 'numero_do1'
		};

		this.hTTPService.get<Response>(environment.serverUrl + url, { params })
		.subscribe((response: Response) => this.setMarkers(response.data, carRegisterColumn, layer, columnCarGid));
	}

	// saveState() {
	// 	const mapState: MapState = {
	// 		selectedBaseLayer: this.selectedBaseLayer,
	// 		selectedLayers: this.selectedLayers,
	// 		primaryLayer: this.selectedPrimaryLayer,
	// 		zoom: this.map.getZoom(),
	// 		center: this.map.getCenter()
	// 	}
	// 	localStorage.setItem('mapState', JSON.stringify(mapState));
	// }
	// async restoreState() {
	// 	const mapState: MapState = JSON.parse(localStorage.getItem('mapState'));
	// 	if (mapState) {
	// 		const center = mapState.center;
	// 		const zoom = mapState.zoom;
	// 		const selectedLayers = mapState.selectedLayers;
	// 		const selectedPrimaryLayer = mapState.primaryLayer;
	// 		await this.sidebarService.sidebarLayerSwitchSelect.next(selectedLayers);
	// 		for (const layer of selectedLayers) {
	// 			await this.sidebarService.sidebarLayerSelect.next(layer);
	// 		}
	// 		await this.sidebarService.sidebarItemRadioSelect.next(selectedPrimaryLayer);
	// 		this.selectedPrimaryLayer = selectedPrimaryLayer;
	// 		this.map.setView(center, zoom);
	// 		localStorage.removeItem('mapState');
	// 	}
	// }
}
