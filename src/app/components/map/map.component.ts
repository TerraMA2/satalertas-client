
import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';

import * as L from 'leaflet';

import 'leaflet.markercluster';

import 'leaflet.fullscreen';

import * as Search from 'leaflet-search';

import { HTTPService } from '../../services/http.service';

import { ConfigService } from '../../services/config.service';

import { SidebarService } from 'src/app/services/sidebar.service';

import { MapService } from 'src/app/services/map.service';

import { LayerType } from 'src/app/enum/layer-type.enum';

import { Layer } from 'src/app/models/layer.model';

import { LayerGroup } from 'src/app/models/layer-group.model';

import { FilterService } from '../../services/filter.service';

import { LinkPopupService } from 'src/app/services/link-popup.service';

import { MapState } from 'src/app/models/map-state.model';

import { LayerInfo } from 'src/app/models/layer-info.model';

import { LayerInfoFeature } from 'src/app/models/layer-info-feature.model';

import { SelectedMarker } from 'src/app/models/selected-marker.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  private map: L.Map;

  selectedLayers: Layer[] = [];

  private mapConfig;

  private layerControl: L.Control.Layers;
  private searchControl;

  markerClusterGroup: L.MarkerClusterGroup;

  markerInfo: L.Marker;

  selectedMarker: SelectedMarker;

  displayTable = false;
  displayFilter = false;
  displayLegend = false;
  displayInfo = false;
  displayLayers = false;
  displayVisibleLayers = false;

  filteredData = [];

  @Input() displayZoomControl = true;
  @Input() displayScaleControl = true;
  @Input() displayFullscreenControl = true;
  @Input() displayInfoControl = true;
  @Input() displayLayerControl = true;
  @Input() displayTableControl = true;
  @Input() displayLegendControl = true;
  @Input() displaySearchControl = true;
  @Input() displayFilterControl = true;
  @Input() displayRestoreMapControl = true;
  @Input() displayVisibleLayersControl = true;
  @Input() attributionControl = true;
  @Input() zoomControl = true;
  @Input() dragging = true;
  @Input() touchZoom = true;
  @Input() boxZoom = true;
  @Input() scrollWheelZoom = true;
  @Input() doubleClickZoom = true;
  @Input() initialLatLong: L.LatLng;
  @Input() initialZoom: number;
  @Input() overlay;
  @Input() height = '95vh';
  @Input() mapId = 'map';

  constructor(
    private hTTPService: HTTPService,
    private configService: ConfigService,
    private sidebarService: SidebarService,
    private mapService: MapService,
    private filterService: FilterService,
    private linkPopupService: LinkPopupService
  ) { }

  ngOnInit() {
    this.mapConfig = this.configService.getConfig('map');
  }

  ngOnDestroy() {
    this.setLocalStorageData();
  }

  ngAfterViewInit() {
    this.setMap();
    this.setControls();
    this.setLayers();
    this.getLocalStorageData();
  }

  setMap() {
    this.map = L.map(this.mapId, {
      maxZoom: this.mapConfig.maxZoom,
      zoomControl: this.displayZoomControl,
      attributionControl: this.attributionControl,
      dragging: this.dragging,
      touchZoom: this.touchZoom,
      boxZoom: this.boxZoom,
      scrollWheelZoom: this.scrollWheelZoom,
      doubleClickZoom: this.doubleClickZoom
    });
    if (this.initialLatLong) {
      this.panMap(this.initialLatLong, this.initialZoom);
    } else {
      this.panMap(this.mapConfig.initialLatLong, this.mapConfig.initialZoom);
    }
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

  // Leaflet controls
  setControls() {
    if (this.displayLayerControl) {
      this.setLayerControl();
    }

    if (this.displayFullscreenControl) {
      this.setFullScreenControl();
    }

    if (this.displayScaleControl) {
      this.setScaleControl();
    }

    if (this.displayFilterControl) {
      this.setFilterControl();
    }

    if (this.displayLegendControl) {
      this.setLegendControl();
    }

    if (this.displayTableControl) {
      this.setTableControl();
    }

    if (this.displaySearchControl) {
      this.setSearchControl();
    }

    if (this.displayInfoControl) {
      this.setInfoControl();
    }

    if (this.displayRestoreMapControl) {
      this.setRestoreMapControl();
    }

    // if (this.displayLayersControl) {
    //   this.setLayersControl();
    // }

    this.setMarkersGroup();
  }

  setLayers() {
    this.setBaseLayers();
    this.setOverlayEvents();
    if (this.overlay) {
      this.setOverlay();
    }
  }

  getLocalStorageData() {
    if (localStorage.getItem('mapState')) {
      const mapState: MapState = JSON.parse(localStorage.getItem('mapState'));
      const previousSelectedLayers: Layer[] = mapState.selectedLayers;
      const previousSelectedMarker: SelectedMarker = mapState.selectedMaker;
      const previousLatLong = mapState.mapLatLong;
      const previousZoom = mapState.mapZoom;

      previousSelectedLayers.forEach((layer: Layer) => {
        this.addLayer(layer, true);
        if (previousSelectedMarker.overlayName === layer.label) {
          this.updateMarkers(layer);
        }
      });
      this.panMap(previousLatLong, previousZoom);
    }
    localStorage.removeItem('mapState');
  }

  setLocalStorageData() {
    if (this.selectedLayers) {
      const mapState = new MapState(
        this.selectedLayers,
        this.selectedMarker,
        this.map.getZoom(),
        [
          this.map.getCenter().lat,
          this.map.getCenter().lng
        ]
      );
      localStorage.setItem('mapState', JSON.stringify(mapState));
    }
  }

  setOverlay() {
    const layer = this.getLayer(this.overlay).addTo(this.map);
    layer.addTo(this.map);
  }

  setBaseLayers() {
    this.mapConfig.baselayers.forEach(baseLayerData => {
      const baseLayer = this.getLayer(baseLayerData);
      const baseLayerName = baseLayerData.name;
      if (this.displayLayerControl) {
        this.layerControl.addBaseLayer(baseLayer, baseLayerName);
      }
      if (baseLayerData.default) {
        baseLayer.addTo(this.map);
      }
    });
  }

  setMarkers(data, popupTitle, overlayName) {
    if (this.markerInfo) {
      this.markerInfo.remove();
    }
    this.layerControl.removeLayer(this.markerClusterGroup);
    data.forEach(markerData => {
      let popup = null;
      let link = null;
      if (popupTitle && markerData[popupTitle]) {
        popup = markerData[popupTitle];
        link = `/report/${popup}`;
      } else {
        popup = popupTitle;
      }

      const popupContent = this.getPopupContent(markerData, overlayName);
      const marker = this.createMarker(popup, popupContent, [markerData.lat, markerData.long], overlayName, link);

      if (marker) {
        this.markerClusterGroup.addLayer(marker);
      }
    });

    this.map.addLayer(this.markerClusterGroup);
    this.searchControl.setLayer(this.markerClusterGroup);
    this.searchControl.options.layer = this.markerClusterGroup;
  }

  createMarker(popupTitle, popupContent, latLong, overlayName, link = '') {
    if (!popupContent) {
      return null;
    }
    const marker = L.marker(latLong, {title: popupTitle});
    marker.bindPopup(popupContent);
    if (link) {
      this.linkPopupService.register(marker, link, 'Relatório');
      marker.on('popupopen', () =>
                this.selectedMarker = new SelectedMarker(overlayName, popupTitle, popupContent, latLong, link));
    }
    return marker;
  }

  setMarkersGroup() {
    this.markerClusterGroup = L.markerClusterGroup({chunkedLoading: true, spiderfyOnMaxZoom: true});
  }

  clearMap() {
    this.map.eachLayer((layer) => layer.remove());
    this.layerControl.remove();
    this.setLayerControl();
    this.setLayers();
    this.selectedLayers = [];
  }

  setOverlayEvents() {
    this.mapService.clearMap.subscribe(() => this.clearMap());

    this.filterService.filterMap.subscribe(() => {
      this.clearLayers();
      this.updateLayers();
    });

    this.sidebarService.sidebarItemSelect.subscribe(itemSelected => {
      if (this.markerInfo) {
        this.markerInfo.remove();
      }
      if (itemSelected instanceof Layer) {
        this.addLayer(itemSelected, true);
      }
      if (itemSelected instanceof LayerGroup) {
        const children = itemSelected.children;
        this.selectedLayers = this.selectedLayers.filter(selectedLayer => 'parent' in selectedLayer);
        children.forEach(child => this.addLayer(child, true));
      }
    });

    this.sidebarService.sidebarItemUnselect.subscribe(itemUnselected => {
      if (this.markerInfo) {
        this.markerInfo.remove();
      }
      if (itemUnselected instanceof Layer) {
        this.removeLayer(itemUnselected, true);
      }
      if (itemUnselected instanceof LayerGroup) {
        const children = itemUnselected.children;
        children.forEach(child => this.removeLayer(child, true));
      }
    });

    this.sidebarService.sidebarItemRadioSelect.subscribe((layer: Layer) => {
      if (this.markerInfo) {
        this.markerInfo.remove();
      }
      layer.markerSelected = true;
      this.updateMarkers(layer);
    });

    this.sidebarService.sidebarItemRadioUnselect.subscribe(layer => {
      layer.markerSelected = false;
      if (this.markerInfo) {
        this.markerInfo.remove();
      }
      if (this.selectedMarker && this.selectedMarker.overlayName === layer.label) {
        this.markerClusterGroup.clearLayers();
      }
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

  setDateFilter(layer) {
    if (layer.type === LayerType.ANALYSIS || layer.type === LayerType.DYNAMIC) {
      const currentDateInput = JSON.parse(localStorage.getItem('dateFilter'));

      layer.layerData.time = `${currentDateInput[0]}/${currentDateInput[1]}`;
    }
    return layer;
  }

  addLayer(layer, addLayer) {
    if (layer && layer.layerData) {
      const layerIndex = this.selectedLayers.findIndex(selectedLayer => selectedLayer.label === layer.label);
      if (layerIndex === -1 || !addLayer) {
        if (addLayer) {
          this.selectedLayers.push(layer);
        }
        layer = this.setDateFilter(layer);
        const layerToAdd = this.getLayer(layer.layerData);
        layerToAdd.setZIndex(1000 + (this.selectedLayers.length));
        layerToAdd.addTo(this.map);
      }
    }
  }

  removeLayer(layer, deselectLayer) {
    if (layer) {
      const layerData = layer.layerData;
      let zindex;
      if (deselectLayer) {
        this.selectedLayers.splice(this.selectedLayers.findIndex(selectedLayer => selectedLayer.value === layer.value), 1);
      }
      this.map.eachLayer((mapLayer: L.TileLayer.WMS) => {

        if (mapLayer.options.layers === layerData.layers) {
          zindex = mapLayer.options.zIndex;
          mapLayer.remove();
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

  // Map controls

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

  setFilterControl() {
    const Filter = L.Control.extend({
      onAdd: () => {
        const div = L.DomUtil.create('div');
        div.innerHTML = `
          <div id="filterBtn" class="leaflet-control-layers leaflet-custom-icon" title="Filtro">
            <a><i class='fas fa-filter'></i></a>
          </div>`;
        return div;
      }
    });

    new Filter({ position: 'topleft' }).addTo(this.map);

    this.setFilterControlEvent();
  }

  setFilterControlEvent() {
    L.DomEvent.on(L.DomUtil.get('filterBtn'), 'dblclick', L.DomEvent.stopPropagation);
    document.querySelector('#filterBtn').addEventListener('click', () => this.displayFilter = !this.displayFilter);
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

    new Legend({ position: 'topleft' }).addTo(this.map);

    this.setLegendControlEvent();
  }

  setLegendControlEvent() {
    L.DomEvent.on(L.DomUtil.get('legendBtn'), 'dblclick', L.DomEvent.stopPropagation);
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

    new Table({ position: 'topleft' }).addTo(this.map);

    this.setTableControlEvent();
  }

  setTableControlEvent() {
    L.DomEvent.on(L.DomUtil.get('tableBtn'), 'dblclick', L.DomEvent.stopPropagation);
    document.querySelector('#tableBtn').addEventListener('click', () => this.displayTable = !this.displayTable);
  }

  setSearchControl() {
    const searchOptions = this.mapConfig.controls.search;
    searchOptions.marker = L.circleMarker([0, 0], this.mapConfig.controls.search.marker);
    this.searchControl = new Search(searchOptions);
    this.map.addControl(this.searchControl);
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
    let popupContent = `<div class="popup-container">`;

    if (this.selectedLayers.length === 0) {
      popupContent += `<h2>Layer não encontrado.</h2>`;
    }

    for (const selectedLayer of this.selectedLayers) {
      const layer = this.getLayer(selectedLayer.layerData);
      const layerName = selectedLayer.label;

      const params = this.getFeatureInfoParams(layer, event);

      const url = `http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms`;

      await this.hTTPService.get(url, params).toPromise().then((layerInfo: LayerInfo) => {
        const features = layerInfo.features;
        popupContent += this.getFeatureInfoPopup(layerName, features);
      });
    }

    if (this.markerInfo) {
      this.markerInfo.removeFrom(this.map);
    }

    popupContent += `</div>`;
    this.markerInfo = this.createMarker('info', popupContent, '', latLong);
    if (this.markerInfo) {
      this.markerInfo.addTo(this.map);
      this.markerInfo.openPopup();
    }
  }

  getFeatureInfoParams(layer: L.TileLayer.WMS, event: L.LeafletMouseEvent) {
    const layerId = layer.wmsParams.layers;
    const layerPoint = this.map.layerPointToContainerPoint(event.layerPoint);
    const bbox = this.map.getBounds().toBBoxString();
    const mapSize = this.map.getSize();
    const width = mapSize.x;
    const height = mapSize.y;
    const x = Math.round(layerPoint.x);
    const y = Math.round(layerPoint.y);
    const params = {
      service: 'WMS',
      version: '1.1.0',
      request: 'GetFeatureInfo',
      layers: layerId,
      bbox,
      width,
      height,
      query_layers: layerId,
      info_format: 'application/json',
      x,
      y
    };
    return params;
  }

  getFeatureInfoPopup(layerName: string, features: LayerInfoFeature[]) {
    let popupContent = '';
    features.forEach(feature => popupContent += this.getPopupContent(feature.properties, layerName));
    return popupContent;
  }

  getPopupContent(data, name) {
    let popupContent = '';
    let popupContentBody = '';
    Object.keys(data).forEach(key => {
      if (key !== 'lat' &&
          key !== 'long' &&
          key !== 'geom' &&
          key !== 'intersection_geom'
          ) {
        popupContentBody += `
            <tr>
              <td>${key}</td>
              <td>${data[key]}</td>
            </tr>
        `;
      }
    });

    popupContent += `
        <br />
        <div class="table-responsive">
          <table class="table table-hover">
              <thead><th colspan="2">${name}</th></thead>
              ${popupContentBody}
          </table>
        </div>
    `;

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

    new RestoreMap({ position: 'topleft' }).addTo(this.map);

    this.setRestoreMapControlEvent();
  }

  setRestoreMapControlEvent() {
    const initialLatLong = this.mapConfig.initialLatLong;
    const initialZoom = this.mapConfig.initialZoom;
    L.DomEvent.on(L.DomUtil.get('restoreMapBtn'), 'dblclick', L.DomEvent.stopPropagation);
    document.querySelector('#restoreMapBtn')
            .addEventListener('click', () => this.panMap(initialLatLong, initialZoom));
  }

  setVisibleLayersControl() {
    const VisibleLayers = L.Control.extend({
      onAdd: () => {
        const div = L.DomUtil.create('div');
        div.innerHTML = `
          <div id="visibleLayersBtn" class="leaflet-control-layers leaflet-custom-icon" title="Layers visíveis">
            <a><i class='fas fa-list'></i></a>
          </div>`;
        return div;
      }
    });

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

  // Events
  onShowTable() {
    this.displayTable = true;
  }

  onHideTable() {
    this.displayTable = false;
  }

  clearLayers() {
    this.selectedLayers.forEach(layer => {
      this.removeLayer(layer, false);
    });
  }

  updateLayers() {
    this.selectedLayers.forEach(layer => {
      if (layer.markerSelected) {
        this.updateMarkers(layer);
      }

      this.addLayer(layer, false);
    });
  }

  private updateMarkers(layer: Layer) {
    this.markerClusterGroup.clearLayers();
    const appConfig = this.configService.getConfig('app');
    let url = '';
    let popupTitle = null;
    if (layer.type === LayerType.ANALYSIS) {
      url = appConfig.analysisLayerUrl;
      popupTitle = layer.carRegisterColumn;
    } else if (layer.type === LayerType.STATIC) {
      url = appConfig.staticLayerUrl;
      popupTitle = layer.carRegisterColumn;
    } else if (layer.type === LayerType.DYNAMIC) {
      url = appConfig.dynamicLayerUrl;
    }
    const viewId = layer.value;

    const date = JSON.parse(localStorage.getItem('dateFilter'));

    this.hTTPService.get(url, {viewId, date})
                    .subscribe(data => this.setMarkers(data, popupTitle, layer.label));
  }

}
