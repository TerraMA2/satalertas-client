import { LayerData } from './layer-data.model';

export class Vision {
  constructor(
    public title: string,
    public image?: string,
    public description?: string,
    public registerCarColumn?: string,
    public layerData?: LayerData
  ) {}
}
