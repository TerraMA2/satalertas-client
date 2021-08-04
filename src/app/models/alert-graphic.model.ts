import { ChartData } from './chart-data.model';

export interface AlertGraphic {
		cod: string,
		codGroup: string,
		label: string,
		active: boolean,
		isEmpty: boolean,
		graphics: ChartData[]
}
