import { ChartData } from './chart-data.model';

export interface AnalysisChart {
		code: string,
		groupCode: string,
		label: string,
		active: boolean,
		isEmpty: boolean,
		charts: ChartData[]
}
