import {ParamAlert} from './param-alert.model';

export class Alert {
    constructor(
        public idview: number,
        public cod: string,
        public codgroup: string,
        public label: string,
        public value2: number,
        public value1: number,
        public selected?: boolean,
        public activearea?: boolean,
        public immobileactive?: boolean,
        public alertsgraphics?: ParamAlert[],
        public isAnalysis?: boolean,
        public isPrimary?: boolean,
        public tableOwner?: string,
        public tableName?: string
    ) {
    }
}
