import { LayerData } from './layer-data.model';

import { Legend } from './legend.model';

import { Tool } from './tool.model';

export class Layer {
  constructor(
    public label: string,
    public value: number,
    public defaultDateInterval: string,
    public dateColumn: string,
    public type: string,
    public isPrivate: boolean,
    public isPrimary: boolean,
    public layerData: LayerData,
    public legend: Legend,
    public tools?: Tool[],
    public markerSelected?: boolean
  ) {}
}
