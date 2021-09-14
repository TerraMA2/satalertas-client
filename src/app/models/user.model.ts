export class User {
	constructor(
		public id: number,
		public name: string,
		public email: string,
		public username: string,
		public administrator: boolean,
		public tokenCode: string,
		public tokenExpirationDate: Date
	) {
	}

	get token() {
		if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
			return null;
		}
		return this.tokenCode;
	}
}
