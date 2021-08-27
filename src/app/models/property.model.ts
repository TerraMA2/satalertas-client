import { Legend } from './legend.model';
import { SynthesisCard } from './synthesis-card.model';

export interface Property {
		gid: string,
		titleDeter: string,
		titleProdes: string,
		titleFireSpot: string,
		titleBurnedArea: string,
		titleDetailedVisions: string,
		titleDeforestation: string,
		historyDeterChartOptions: [],
		historyProdesChartOptions: [],
		historyFireSpotChartOptions: [],
		historyBurnedChartOptions: [],
		register: string,
		federalregister: string,
		area: string,
		area_km: string,
		name: string,
		city: string,
		cpf: string,
		owner: string,
		county: string,
		citybbox: string,
		statebbox: string,
		bbox: string,
		bboxplanet: string,
		lat: string,
		long: string,
		visions: SynthesisCard[],
		legends: Legend[],
		detailedVisions: SynthesisCard[],
		deforestations: SynthesisCard[],
		deterHistory: SynthesisCard[],
		prodesHistory: SynthesisCard[],
		fireSpotHistory: SynthesisCard[],
		burnedAreaHistory: SynthesisCard[]
}
