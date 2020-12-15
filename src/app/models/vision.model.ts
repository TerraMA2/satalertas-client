import {LayerData} from './layer-data.model';

export class Vision {
    constructor(
        public title: string,
        public image?: string,
        public description?: object,
        public carRegisterColumn?: string,
        public layerData?: LayerData
    ) {
    }
}
