import { AnalysisChart } from './analysis-chart.model';

export interface Analysis {
		idview: number,
		cod: string,
		codgroup: string,
		label: string,
		alert: number,
		area: number,
		selected?: boolean,
		activearea?: boolean,
		activealert?: boolean,
		analysischarts?: AnalysisChart[],
		isAnalysis?: boolean,
		isPrimary?: boolean,
		tableOwner?: string,
		tableName?: string
}
