import { Layer } from './layer.model';
import { LatLng } from 'leaflet';

export interface MapState {
	selectedLayers: Layer[],
	selectedBaseLayer: string,
	primaryLayer: Layer,
	zoom: number
	center: LatLng
}
