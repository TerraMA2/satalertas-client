import { ChartData } from './chart-data.model';

export interface AnalysisChart {
		cod: string,
		groupCode: string,
		label: string,
		active: boolean,
		isEmpty: boolean,
		charts: ChartData[]
}
