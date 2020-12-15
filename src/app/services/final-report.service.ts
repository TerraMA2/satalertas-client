import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FinalReportService {
    URL_REPORT_SERVER = environment.reportServerUrl;

    constructor(
        private http: HttpClient
    ) {
    }

    async getReportCarData(carRegister, date, filter, type) {
        const url = `${this.URL_REPORT_SERVER}/report/getReportCarData`;

        const parameters = {carRegister, date, filter, type};

        return await this.http.get(url, {params: parameters}).toPromise();
    }

    getHeader() {
        return [
            {
                image: this.getBaseImage('assets/img/logos/logo-mpmt2.png'),
                width: 180,
                height: 50,
                alignment: 'left',
                margin: [30, 25, 0, 30]
            },
            {
                text: [
                    {
                        text: 'Procuradoria Geral de Justiça\n',
                        bold: true
                    },
                    {
                        text: 'Centros de Apoio Operacional\n',
                        bold: false
                    },
                    {
                        text: 'Centro de Apoio à Execução Ambiental',
                        bold: false
                    }
                ],
                fontSize: 9,
                alignment: 'left',
                margin: [30, 30, 0, 5]
            }
        ];
    }

    getBaseImageUrl(url: string) {
        const baseImage = [];
        this.getBase64ImageFromUrl(url).then(result => baseImage.push(result)).catch(err => console.error(err));
        return baseImage;
    }

    async getBase64ImageFromUrl(imageUrl) {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result), false);
            reader.onerror = () => reject(this);
            reader.readAsDataURL(blob);
        });
    }

    toDataUrl(file, callback) {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = () => {
            const reader = new FileReader();
            reader.onloadend = () => callback(reader.result);
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', file);
        xhr.send();
    }

    getBaseImage(fileLocation: string) {
        const baseImage = [];
        this.toDataUrl(fileLocation, base64Image => baseImage.push(base64Image));
        return baseImage;
    }
}
