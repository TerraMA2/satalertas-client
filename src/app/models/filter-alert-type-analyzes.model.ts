export class FilterAlertAnalyses {
    constructor(
        public label: string,
        public type: string,
        public valueOption: string,
        public options: any,
        public valueOptionBiggerThen?: string
    ) {
    }
}
