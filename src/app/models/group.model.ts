import { Layer } from './layer.model';

export class Group {
  constructor(
    public label: string,
    public parent: boolean,
    public link?: string,
    public children?: Layer[]
  ) {}
}
