import { LayerData } from './layer-data.model';

import { Legend } from './legend.model';

import { Tool } from './tool.model';

export class Layer {
  constructor(
    public codGroup: string,
    public label: string,
    public shortLabel: string,
    public value: number,
    public dateColumn: string,
    public geomColumn: string,
    public areaColumn: string,
    public carRegisterColumn: string,
    public classNameColumn: string,
    public type: string,
    public isPrivate: boolean,
    public isPrimary: boolean,
    public layerData: LayerData,
    public legend: Legend,
    public popupTitle: string,
    public tools?: Tool[],
    public markerSelected?: boolean
  ) {}
}
