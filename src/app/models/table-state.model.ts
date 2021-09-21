import { ReportLayer } from './report-layer.model';

export interface TableState {
	selectedLayer: ReportLayer,
	first: number,
	rows: number,
	sortField: string,
	sortOrder: number,
	columnOrder: []
}
