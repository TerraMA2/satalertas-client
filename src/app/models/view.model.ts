export class View {
    constructor(
        public id: number,
        public cod: string,
        public codgroup: string,
        public isAnalysis: boolean,
        public isPrimary: boolean,
        public tableOwner?: string,
        public tableName?: string
    ) {
    }
}
