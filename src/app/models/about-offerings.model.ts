import { AboutLogo } from './about-logo.model';

export class AboutOfferings {
	constructor(
		public title: string,
		public companies: AboutLogo[][],
	) {
	}
}
