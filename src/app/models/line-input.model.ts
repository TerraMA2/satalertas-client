import {ConfInputsModel} from './conf-inputs.model';

export class LineInputModel {
  constructor(
     public show: boolean,
     public label: string,
     public inputs: ConfInputsModel[]
  ) { }
}
