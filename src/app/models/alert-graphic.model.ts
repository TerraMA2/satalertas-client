import { Graphic } from './Graphic.model';

export class AlertGraphic {
  constructor(
    public cod: string,
    public label: string,
    public labelCity: string,
    public labelBiome: string,
    public type: string,
    public nameType: string,
    public idview: number,
    public active: boolean,
    public graphicCity: Graphic,
    public graphicBiome: Graphic
  ) {}
}
