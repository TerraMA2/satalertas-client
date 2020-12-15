export class LayerData {
    constructor(
        public url: string,
        public layers: string,
        public transparent: boolean,
        public format: string,
        public version: string,
        public cqlFilter?: string,
        public time?: string,
        public bbox?: string,
        public width?: string,
        public height?: string,
        public srs?: string
    ) {
    }
}
