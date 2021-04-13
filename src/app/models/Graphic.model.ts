import {ChartData} from './chart-data.model';

export class Graphic {
    constructor(
        public data: ChartData[],
        options: Options
    ) {
    }
}

export class Options {
    constructor(
        public title: {
            display: boolean,
            text: string,
            fontSize: number
        },
        public legend: {
            position: string
        }
    ) {
    }
}
