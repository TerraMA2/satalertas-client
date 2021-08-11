import { ChartData } from './chart-data.model';

export interface AnalysisChart {
		cod: string,
		codGroup: string,
		label: string,
		active: boolean,
		isEmpty: boolean,
		charts: ChartData[]
}
