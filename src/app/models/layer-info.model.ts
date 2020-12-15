import {LayerInfoFeature} from './layer-info-feature.model';

export class LayerInfo {
    constructor(
        public type: string,
        public totalFeatures: string,
        public features: LayerInfoFeature[],
        public crs: object,
        public bbox: []
    ) {
    }
}
