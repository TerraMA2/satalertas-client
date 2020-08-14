export class Util {
    constructor() {
    }

    public static telephoneMask(v) {
        v = v.replace(/\D/g, '');
        v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
        v = v.replace(/(\d)(\d{4})$/, '$1-$2');
        return v;
    }

    public static zipCodeMask(v) {
        v = v.replace(/\D/g, '');
        v = v.replace(/(\d{2})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d{2,3})$/, '$1/$2');
        return v;
    }

    public static cpfMask(v) {
        v = v.replace(/\D/g, '');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return v;
    }

    public static cnpjMask(v) {
        v = v.replace(/\D/g, '');
        v = v.replace(/^(\d{2})(\d)/, '$1.$2');
        v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
        v = v.replace(/(\d{4})(\d)/, '$1-$2');
        return v;
    }

    public static cpfCnpjMask(v) {
        if (v && v.length > 0) {
            const type = v.replace(/\D/g, '').length < 12 ? 'cpf' : 'cnpj';

            if (type === 'cpf') {
                return this.cpfMask(v);
            } else {
                return this.cnpjMask(v);
            }
        }
    }

    public static checkCPF(inputCPF) {
        let soma = 0;
        let resto;
        inputCPF = inputCPF.replace(/\D/g, '');
        if (inputCPF === '00000000000') {
            return false;
        }

        for (let i = 1; i <= 9; i++) {
            soma = soma + parseInt(inputCPF.substring(i - 1, i), 10) * (11 - i);

            resto = (soma * 10) % 11;
        }

        if ((resto === 10) || (resto === 11)) {
            resto = 0;
        }
        if (resto !== parseInt(inputCPF.substring(9, 10), 10)) {
            return false;
        }

        soma = 0;
        for (let i = 1; i <= 10; i++) {

            soma = soma + parseInt(inputCPF.substring(i - 1, i), 10) * (12 - i);
            resto = (soma * 10) % 11;
        }

        if ((resto === 10) || (resto === 11)) {
            resto = 0;
        }
        return resto === parseInt(inputCPF.substring(10, 11), 10);
    }

    public static base64toBlob(content, contentType) {
        contentType = contentType || '';

        const sliceSize = 512;

        const byteCharacters = window.atob(content);

        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, {
            type: contentType
        });
    }

    public static getMimeType(selectedFormats) {
        const fileType = {};
        if (selectedFormats.length > 1) {
            fileType['mimetype'] = 'application/zip';
            fileType['format'] = 'zip';
            return fileType;
        } else {
            if (selectedFormats[0] === 'csv') {
                fileType['mimetype'] = 'text/csv';
                fileType['format'] = 'csv';
            } else if (selectedFormats[0] === 'kml') {
                fileType['mimetype'] = 'application/vnd.google-earth.kml+xml';
                fileType['format'] = 'kml';
            } else if (selectedFormats[0] === 'geojson') {
                fileType['mimetype'] = 'application/vnd.google-earth.geo+json';
                fileType['format'] = 'geojson';
            } else if (selectedFormats[0] === 'shapefile') {
                fileType['mimetype'] = 'application/zip';
                fileType['format'] = 'zip';
            }
        }
        return fileType;
    }
}
