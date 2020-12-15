export class ChartData {
    constructor(
        public labels: string[],
        public datasets: Datasets[]
    ) {
    }
}

export class Datasets {
    constructor(
        public data: number[],
        public backgroundColor: string[],
        public hoverBackgroundColor: []
    ) {
    }
}
