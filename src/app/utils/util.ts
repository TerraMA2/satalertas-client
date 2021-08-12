export class Util {
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
