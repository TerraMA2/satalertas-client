import { ChartData } from './chart-data.model';

export class AlertGraphic {
  constructor(
    public cod: string,
    public codGroup: string,
    public label: string,
    public active: boolean,
    public isEmpty: boolean,
    public graphics: ChartData[]
  ) {}
}
