import {Layer} from './layer.model';

export class LayerGroup {
    constructor(
        public cod: string,
        public label: string,
        public parent: boolean,
        public isPrivate: boolean,
        public icon?: string,
        public view_graph?: boolean,
        public activeArea?: boolean,
        public children?: Layer[],
        public tableOwner?: string,
        public tableName?: string
    ) {
    }
}
