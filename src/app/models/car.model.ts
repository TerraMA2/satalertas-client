export class Car {
  constructor(
    public idCar: number,
    public mtCarNumber: string,
    public propertyName: string,
    public cityName: string,
    public propertyArea: number,
    public status: string,
    public gid?: number,
    public federalCarNumber?: string,
    public geom?: string
  ) {}
}
