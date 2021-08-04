import { LayerInfoFeature } from './layer-info-feature.model';

export interface LayerInfo {
		type: string,
		totalFeatures: string,
		features: LayerInfoFeature[],
		crs: object,
		bbox: []
}
