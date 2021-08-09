import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

import * as L from 'leaflet';

import 'leaflet.markercluster';

import 'leaflet.fullscreen';

import 'leaflet-draw';

import * as Search from 'leaflet-search';

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

import { AuthService } from 'src/app/services/auth.service';

import { environment } from 'src/environments/environment';

import { PopupService } from '../../services/popup.service';

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
	displayInfo = false;
	displayVisibleLayers = false;
	displayLayerTools = false;
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
		private popupService: PopupService,
		private authService: AuthService
	) {
	}

	ngOnInit() {
		this.mapConfig = this.configService.getMapConfig();
		this.tableConfig = this.configService.getMapConfig('table');
		this.sidebarService.sidebarLayerShowHide.next(true);
		this.sidebarService.sidebarReload.next();
	}

	async ngAfterViewInit() {
		this.setMap();
		this.setControls();
		this.setBaseLayers();
		this.setEvents();
	}

	setMap() {
		this.map = this.mapService.getMap(this.mapConfig.maxZoom)
		this.mapService.panMap(this.map, this.mapConfig.initialLatLong, this.mapConfig.initialZoom);
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
		this.setInfoControl();
		this.setRestoreMapControl();
		this.setVisibleLayersControl();
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
		this.map.on('baselayerchange', layer => {
			this.selectedBaseLayer = layer['name'];
		});
	}

	setMarkersGroup() {
		this.markerClusterGroup = this.mapService.getMarkersGroup();
		this.map.addLayer(this.markerClusterGroup);
	}

	private updateMarkers(layer: Layer) {
		this.markerClusterGroup.clearLayers();
		this.clearMarkerInfo();
		this.layerControl.removeLayer(this.markerClusterGroup);

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

		const params = this.filterService.getParams({ view });

		const columnCarGid = layer.type === LayerType.ANALYSIS ? 'de_car_validado_sema_gid' : 'gid';
		const carRegisterColumn = {
			federal: layer.type === LayerType.ANALYSIS ? 'de_car_validado_sema_numero_do2' : 'numero_do2',
			estadual: layer.type === LayerType.ANALYSIS ? 'de_car_validado_sema_numero_do1' : 'numero_do1'
		};

		this.hTTPService.get<any>(environment.serverUrl + url, {params})
		.subscribe(data => this.setMarkers(data, carRegisterColumn, layer, columnCarGid));
	}

	async setMarkers(data, carRegister, layer, columnCarGid) {
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

	updateLayers() {
		this.selectedLayers.forEach(layer => {
			this.updateMarkers(layer);
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
		document.querySelector('#legendBtn').addEventListener('click', () => this.displayLegend = !this.displayLegend);
	}

	setTableControl() {
		const Table = this.mapService.getTableControl();
		new Table({ position: 'topleft' }).addTo(this.map);
		this.setTableControlEvent();
	}

	setTableControlEvent() {
		L.DomEvent.on(L.DomUtil.get('tableBtn'), 'click dblclick', L.DomEvent.stopPropagation);
		document.querySelector('#tableBtn').addEventListener('click', () => {
			this.displayTable = true;
		});
	}

	setSearchControl() {
		const searchOptions = this.mapConfig.controls.search;
		searchOptions.moveToLocation = latlng => {
			this.markerClusterGroup.eachLayer((marker: L.Marker) => {
				if (marker.getLatLng().equals(latlng)) {
					this.mapService.panMap(this.map, latlng, 18);
					marker.fire('click');
				}
			});
		};
		searchOptions.marker = L.circleMarker([0, 0], this.mapConfig.controls.search.marker);
		this.searchControl = new Search(searchOptions);
		this.map.addControl(this.searchControl);
	}

	setCoordinatesControl() {
		const Coordinates = this.mapService.getCoordinatesControl();
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
		const Info = this.mapService.getInfoControl();

		new Info({ position: 'topleft' }).addTo(this.map);

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

	createMarker(title, latLong, layerLabel, gid, codGroup, layer?) {
		const marker = L.marker(latLong, { title });
		this.popupService.register(marker, layerLabel, gid, codGroup, layer);
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
		await this.mapService.getFeatureInfo(this.selectedLayers, this.map, latLong, layerPoint, this.markerInfo);
	}

	setRestoreMapControl() {
		const RestoreMap = this.mapService.getRestoreMapControl();

		new RestoreMap({ position: 'topleft' }).addTo(this.map);

		this.setRestoreMapControlEvent();
	}

	setRestoreMapControlEvent() {
		const initialLatLong = this.mapConfig.initialLatLong;
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
			const hasLayer = this.selectedLayers.some(selectedLayer => selectedLayer.value === layer.value);
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

	clearLayers() {
		this.selectedLayers.forEach(layer => this.removeLayer(layer, false));
	}

	// Events

	setEvents() {
		this.mapService.layerOpactity.subscribe((layerObject) => {
			this.mapService.setOpacity(layerObject['layer'], layerObject['value'], this.map);
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

		this.mapService.clearMap.subscribe(() => this.clearMap());

		this.mapService.clearMarkers.subscribe(() => {
			this.markerClusterGroup.clearLayers();
		});

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
			this.updateMarkers(layer);
		});

		this.sidebarService.sidebarItemRadioDeselect.subscribe((layer: Layer) => {
			if (this.selectedPrimaryLayer && this.selectedPrimaryLayer.value === layer.value) {
				this.selectedPrimaryLayer = null;
			}
			this.clearMarkerInfo();
		});
	}

	onShowTable() {
		this.displayTable = true;
	}

	onHideTable() {
		this.displayTable = false;
		this.tableService.clearTable.next();
		this.tableSelectedLayer = null;
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
