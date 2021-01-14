export class ConfButtonModel {
  constructor(
     public disable: boolean,
     public label: string,
     public buttonClass: string,
     public size?: number,
     public action?: any,
     public show?: boolean,
     public left?: boolean,
     public type?: string,
     public buttonClassIco?: string,
     public required?: boolean
  ) { }
}
