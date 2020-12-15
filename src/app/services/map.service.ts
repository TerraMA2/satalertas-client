import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';

import {Layer} from '../models/layer.model';
import {Util} from '../utils/util';
import * as L from 'leaflet';
import {LatLngBounds} from 'leaflet';

@Injectable({
    providedIn: 'root'
})
export class MapService {

    resetLayers = new Subject();

    clearMap = new Subject();

    reportTable = new Subject();

    showMarker = new Subject();

    reportTableButton = new Subject<boolean>();

    layerToolOpen = new Subject<object>();

    layerToolClose = new Subject();

    legendClose = new Subject();

    layerExtent = new Subject<Layer>();

    layerOpactity = new Subject<object>();

    layerSlider = new Subject<object>();

    clearMarkers = new Subject();

    constructor() {
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
                           <td>${alias}</td>
                           <td>${this.formatterCpfCnpj(data[key])}</td>
                        </tr>`;
                } else {
                    popupContentBody += `
                        <tr>
                            <td>${alias}</td>
                            <td>${data[key]}</td>
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
                        <th colspan="2">${name}</th>
                    </tr>
                </thead>
                ${popupContentBody}
              </table>
            </div>
        `;

        return popupContent;
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
                        cpfCnpj += `, ${Util.cpfCnpjMask(value)}`;
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
}
