import { LayerData } from './layer-data.model';

export class Vision {
  constructor(
    public id: string,
    public title: string,
    public image?: string,
    public description?: string,
    public layerData?: LayerData
  ) {}
}
