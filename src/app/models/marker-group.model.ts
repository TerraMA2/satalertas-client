export class MarkerGroup {
  constructor(
    public title: string,
    public overlayName: string,
    public data: [],
    public marker?: L.GeoJSON
  ) {}
}
