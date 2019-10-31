import { Layer } from './layer.model';

export class LayerGroup {
  constructor(
    public cod: string,
    public label: string,
    public parent: boolean,
    public link: string,
    public isPrivate: boolean,
    public children?: Layer[],
    public selected?: boolean,
    public viewGraph?: boolean
  ) {}
}
