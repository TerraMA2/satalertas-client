export class SelectedMarker {
    constructor(
        public overlayName: string,
        public title: string,
        public content: string,
        public latLong?: number[],
        public link?: string
    ) {
    }
}
