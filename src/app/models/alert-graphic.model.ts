import {Graphic} from './Graphic.model';

export class AlertGraphic {
  constructor(
    public cod: string,
    public label: string,
    public nameType: string,
    public type: string,
    public idView: number,
    public active: boolean,
    public graphicMunicipios: Graphic,
    public graphicBiomas: Graphic
  ) {}
}
