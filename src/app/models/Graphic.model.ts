import {ChartData} from './chart-data.model';

export class Graphic {
  constructor(
    public labels: string[],
    public datasets: ChartData[]
  ) {}
}
