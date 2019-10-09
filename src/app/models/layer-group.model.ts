import { Layer } from './layer.model';

export class LayerGroup {
  constructor(
    public label: string,
    public parent: boolean,
    public link: string,
    public children?: Layer[],
    public selected?: boolean,
    public viewGraph?: boolean
  ) {}
}
