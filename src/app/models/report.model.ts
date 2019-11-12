import { ReportDeforestationArea } from './report-deforestation-area.model';

export class Report {
    constructor(
        public title: string,
        public city: string,
        public county: string,
        public reportNumber: string,
        public farm: string,
        public cpf: string,
        public carRegister: string,
        public deforestation: number,
        public period: object,
        public deforestationAreas?: ReportDeforestationArea[]
    ) {}
}
