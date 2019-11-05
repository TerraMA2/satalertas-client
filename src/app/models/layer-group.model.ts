import { Layer } from './layer.model';

import { LayerData } from './layer-data.model';

import { Legend } from './legend.model';

export class LayerGroup {
  constructor(
    public label: string,
    public parent: boolean,
    public link: string,
    public isPrivate: boolean,
    public icon?: string,
    public method?: string,
    public value?: number,
    public type?: string,
    public carRegisterColumn?: string,
    public layerData?: LayerData,
    public legend?: Legend,
    public source?: string,
    public limit?: string,
    public children?: Layer[],
    public selected?: boolean,
    public viewGraph?: boolean,
    public activeArea?: boolean
  ) {}
}
