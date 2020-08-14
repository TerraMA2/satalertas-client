import {Layer} from './layer.model';

import {SelectedMarker} from './selected-marker.model';

export class MapState {
    constructor(
        public selectedLayers: Layer[],
        public selectedMaker: SelectedMarker,
        public mapZoom: number,
        public mapLatLong: number[],
        public reportTableOpened: boolean,
        public selectedBaseLayer: string
    ) {
    }
}
