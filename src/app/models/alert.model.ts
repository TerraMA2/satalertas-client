
export class Alert {
  constructor(
    public cod: string,
    public label: string,
    public area: number,
    public numCar: number,
    public selected?: boolean,
    public viewGraph?: boolean,
    public activeArea?: boolean,
    public immobileActive?: boolean
  ) {}
}
