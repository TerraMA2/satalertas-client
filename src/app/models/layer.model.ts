import { LayerData } from './layer-data.model';

import { Legend } from './legend.model';

import { Tool } from './tool.model';

import { LayerFilter } from './layer-filter.model';

export interface Layer {
	code: string, // label em maiúsculo, espaços substiuido por underscore
	groupCode: string, // cogido do grupo
	name: string,
	shortName: string,
	description: string,
	viewId: number, // id da view
	dateColumn: string,// opcional
	geomColumn: string,
	areaColumn: string, // opcional
	carRegisterColumn: string,
	classNameColumn: string, // opcional
	type: string,
	showMarker: boolean,
	isPrivate: boolean,
	isPrimary: boolean,
	isSublayer: boolean,
	isAlert: boolean,
	filter: LayerFilter[],
	layerData: LayerData,
	legend: Legend,
	popupTitle: string,
	infoColumns: object[],
	isHidden: boolean,
	isDisabled: boolean,
	tools: Tool[],
	markerSelected: boolean,
	tableOwner: string,
	tableName: string,
	subLayers: Layer[],
	id: number,
	leafletId: number,
}
