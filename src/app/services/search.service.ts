import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SearchService {
	K0 = 0.9996;

	E = 0.00669438;
	E2 = Math.pow(this.E, 2);
	E3 = Math.pow(this.E, 3);
	E_P2 = this.E / (1 - this.E);

	SQRT_E = Math.sqrt(1 - this.E);
	_E = (1 - this.SQRT_E) / (1 + this.SQRT_E);
	_E2 = Math.pow(this._E, 2);
	_E3 = Math.pow(this._E, 3);
	_E4 = Math.pow(this._E, 4);
	_E5 = Math.pow(this._E, 5);

	M1 = 1 - this.E / 4 - 3 * this.E2 / 64 - 5 * this.E3 / 256;
	M4 = 35 * this.E3 / 3072;

	P2 = 3 / 2 * this._E - 27 / 32 * this._E3 + 269 / 512 * this._E5;
	P3 = 21 / 16 * this._E2 - 55 / 32 * this._E4;
	P4 = 151 / 96 * this._E3 - 417 / 128 * this._E5;
	P5 = 1097 / 512 * this._E4;

	R = 6378137;

	ZONE_LETTERS = 'CDEFGHJKLMNPQRSTUVWXX';

	constructor() {
	}

	utmToLatLng(east, north, zone): number[] {
		if (!zone) {
			throw new Error('Invalid zone value');
		}

		if (!north) {
			throw new Error('Invalid north value');
		}

		if (!east) {
			throw new Error('Invalid east value');
		}

		const [zoneNum, zoneLetter] = zone.match(/[a-z]+|[^a-z]+/gi);
		if (!zoneLetter || !zoneNum) {
			throw new Error('Invalid zone value');
		}

		if (east < 100000 || 1000000 <= east) {
			throw new RangeError('East value out of range (must be between 100 000 m and 999 999 m)');
		}
		if (north < 0 || north > 10000000) {
			throw new RangeError('North value out of range (must be between 0 m and 10 000 000 m)');
		}
		if (zoneNum < 1 || zoneNum > 60) {
			throw new RangeError('Zone number out of range (must be between 1 and 60)');
		}
		let northern;
		if (zoneLetter) {
			if (zoneLetter.length !== 1 || this.ZONE_LETTERS.indexOf(zoneLetter) === -1) {
				throw new RangeError('Zone letter out of range (must be between C and X)');
			}
			northern = zoneLetter >= 'N';
		}

		const x = east - 500000;
		let y = northern;

		if (!north) {
			y -= 1e7;
		}

		const m = y / this.K0;
		const mu = m / (this.R * this.M1);

		const pRad = mu +
			this.P2 * Math.sin(2 * mu) +
			this.P3 * Math.sin(4 * mu) +
			this.P4 * Math.sin(6 * mu) +
			this.P5 * Math.sin(8 * mu);

		const pSin = Math.sin(pRad);
		const pSin2 = Math.pow(pSin, 2);

		const pCos = Math.cos(pRad);

		const pTan = Math.tan(pRad);
		const pTan2 = Math.pow(pTan, 2);
		const pTan4 = Math.pow(pTan, 4);

		const epSin = 1 - this.E * pSin2;
		const epSinSqrt = Math.sqrt(epSin);

		const n = this.R / epSinSqrt;
		const r = (1 - this.E) / epSin;

		const c = this._E * pCos * pCos;
		const c2 = c * c;

		const d = x / (n * this.K0);
		const d2 = Math.pow(d, 2);
		const d3 = Math.pow(d, 3);
		const d4 = Math.pow(d, 4);
		const d5 = Math.pow(d, 5);
		const d6 = Math.pow(d, 6);

		const latitude = pRad - (pTan / r) *
			(d2 / 2 -
				d4 / 24 * (5 + 3 * pTan2 + 10 * c - 4 * c2 - 9 * this.E_P2)) +
			d6 / 720 * (61 + 90 * pTan2 + 298 * c + 45 * pTan4 - 252 * this.E_P2 - 3 * c2);
		const longitude = (d -
			d3 / 6 * (1 + 2 * pTan2 + c) +
			d5 / 120 * (5 - 2 * c + 28 * pTan2 - 3 * c2 + 8 * this.E_P2 + 24 * pTan4)) / pCos;

		return [this.toDegrees(Number(latitude)), this.toDegrees(Number(longitude)) + this.zoneNumberToCentralLongitude(Number(zoneNum))]
	}

	dMSToLatLng(degrees, minutes, seconds): number {
		if (!Number(degrees)) {
			throw new Error('Invalid degree');
		}
		if (!Number(minutes)) {
			throw new Error('Invalid minutes');
		}
		if (!Number(seconds)) {
			throw new Error('Invalid seconds');
		}
		return Number(degrees) + (Number(minutes / 60)) + (Number(seconds / 3600));
	}

	private zoneNumberToCentralLongitude(zoneNum): number {
		return (Number(zoneNum) - 1) * 6 - 180 + 3;
	}

	private toDegrees(rad): number {
		return Number(rad) / Math.PI * 180;
	}

	validateLatLng(latitude, longitude) {
		if (!Number(latitude)) {
			return 'Invalid latitude';
		}
		if (!Number(longitude)) {
			return 'Invalid longitude';
		}
		if (latitude < -90 || latitude > 90) {
			return 'Invalid latitude';
		} else if (longitude < -180 || longitude > 180) {
			return 'Invalid longitude';
		}
		return true;
	}

}
