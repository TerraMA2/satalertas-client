import {LayerData} from './layer-data.model';

import {Legend} from './legend.model';

import {Tool} from './tool.model';

import {LayerFilter} from './layer-filter.model';

export class Layer {
    constructor(
        public cod: string,
        public codgroup: string,
        public label: string,
        public shortLabel: string,
        public description: string,
        public value: number,
        public dateColumn: string,
        public geomColumn: string,
        public areaColumn: string,
        public carRegisterColumn: string,
        public classNameColumn: string,
        public type: string,
        public isPrivate: boolean,
        public isPrimary: boolean,
        public isChild: boolean,
        public filter: LayerFilter[],
        public layerData: LayerData,
        public legend: Legend,
        public popupTitle: string,
        public infoColumns: object[],
        public isHidden?: boolean,
        public isDisabled?: boolean,
        public tools?: Tool[],
        public markerSelected?: boolean,
        public tableOwner?: string,
        public tableName?: string,
        public leafletId?: number
    ) {
    }
}
