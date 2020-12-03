export class ReportLayer {
    constructor(
        public codgroup: string,
        public count: boolean,
        public countAlias: string,
        public isDynamic: boolean,
        public label: string,
        public seq: number,
        public sortField: string,
        public sum: boolean,
        public sumAlias: string,
        public sumField: string,
        public tableAlias: string,
        public tableName: string,
        public type: string,
        public value: number,
    ) {
    }
}
