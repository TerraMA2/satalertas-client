export class LayerInfoFeature {
    constructor(
        public geometry: object,
        public geometryName: string,
        public id: string,
        public properties: object,
        public type: string
    ) {
    }
}
