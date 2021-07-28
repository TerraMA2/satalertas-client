import {Layer} from './layer.model';

export class LayerGroup {
    constructor(
        public idGroup: string,
        public cod: string,
        public label: string,
        public parent: boolean, // tirar
        public isPrivate: boolean, // tirar
        public icon?: string, // tirar
        public view_graph?: boolean,
        public activeArea?: boolean, // Ver possibilidade de remover
        public children?: Layer[],
        public tableOwner?: string, // remover
        public tableName?: string, //
    ) {
    }
}
