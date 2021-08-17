import { LayerData } from './layer-data.model';

import { Legend } from './legend.model';

import { Tool } from './tool.model';

import { LayerFilter } from './layer-filter.model';

export class Layer {
	constructor(
		public cod: string, // label em maiúsculo, espaços substiuido por underscore
		public codgroup: string, // cogido do grupo
		public label: string,
		public shortLabel: string,
		public description: string,
		public value: number, // id da view
		public dateColumn: string,// opcional
		public geomColumn: string,
		public areaColumn: string, // opcional
		public carRegisterColumn: string,
		public classNameColumn: string, // opcional
		public type: string,
		public showMarker: boolean,
		public isPrivate: boolean,
		public isPrimary: boolean,
		public isChild: boolean,
		public isAlert: boolean,
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
		public subLayers?: [],
		public layerId?: number, 
		public leafletId?: number,
	) {
	}
}
