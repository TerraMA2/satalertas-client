export class View {
	constructor(
		public id: number,
		public cod: string,
		public groupCode: string,
		public isAnalysis: boolean,
		public isPrimary: boolean,
		public tableOwner?: string,
		public tableName?: string
	) {
	}
}
