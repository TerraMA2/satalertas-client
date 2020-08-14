export class FilterDate {
    constructor(
        public label: string,
        public name: string,
        public dateFormat: string,
        public selectionMode: string,
        public showTime: boolean,
        public showButtonBar: boolean,
        public numberOfMonths: number
    ) {
    }
}
