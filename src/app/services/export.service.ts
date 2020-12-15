import {Injectable} from '@angular/core';

import {environment} from '../../environments/environment';

import {HTTPService} from './http.service';

import {Response} from '../models/response.model';

import {Util} from '../utils/util';

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    constructor(
        private httpService: HTTPService
    ) {
    }

    async export(params, selectedFormats, fileName) {
        const url = `${environment.reportServerUrl}/export/get`;

        await this.httpService.post(url, {params}).toPromise().then((response: Response) => {
            if (response.status === 200) {
                const responseData = response.data;
                const fileType = Util.getMimeType(selectedFormats);
                const downloadURL = window.URL.createObjectURL(Util.base64toBlob(responseData, fileType['mimeType']));

                const linkTag = document.createElement('a');
                linkTag.setAttribute('download', `${fileName}.${fileType['format']}`);
                linkTag.setAttribute('href', downloadURL);
                linkTag.click();
            }
        });
    }
}
