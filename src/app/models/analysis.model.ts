import { AnalysisChart } from './analysis-chart.model';

export interface Analysis {
		viewId: number,
		code: string,
		groupCode: string,
		shortName: string,
		alert: number,
		area: number,
		selected?: boolean,
		activeArea?: boolean,
		activeAlert?: boolean,
		analysisCharts?: AnalysisChart[],
		isAnalysis?: boolean,
		isPrimary?: boolean,
		tableOwner?: string,
		tableName?: string
}
