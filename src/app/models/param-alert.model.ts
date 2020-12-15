export class ParamAlert {
    constructor(
        public idview: number,
        public cod: string,
        public codgroup: string,
        public label: string,
        public activearea?: boolean,
        public isPrimary?: boolean,
        public isAnalysis?: boolean,
        public tableOwner?: string,
        public tableName?: string
    ) {
    }
}
