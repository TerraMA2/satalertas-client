export class Property {
  constructor(
    public register: string,
    public area: number,
    public name: string,
    public city: string,
    public citybbox: string,
    public bbox: string,
    public latLong: string[],
    public burningSpotlights?: [],
    public burnedAreas?: [],
    public deter?: []
  ) {}
}
