export class ConfInputsModel {
  constructor(
     public show: boolean,
     public disable: boolean,
     public label: string,
     public inputClass: string,
     public type: string,
     public onChange?: any,
     public model?: any,
     public field?: string,
     public name?: string,
     public required?: boolean
  ) { }
}
