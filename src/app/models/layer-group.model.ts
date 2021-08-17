import { Layer } from './layer.model';

export interface LayerGroup {
	id: string,
	code: string,
	name: string,
	parent: boolean, // tirar
	isPrivate: boolean, // tirar
	icon?: string, // tirar
	dashboard?: boolean,
	activeArea?: boolean, // Ver possibilidade de remover
	children?: Layer[],
	tableOwner?: string, // remover
	tableName?: string, //
}
