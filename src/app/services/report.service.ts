import { Injectable } from '@angular/core';

import { Property } from '../models/property.model';

import { Subject } from 'rxjs';

import { Vision } from '../models/vision.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  property = new Subject<Property>();

  constructor() { }

  getVisions(propertyData: Property, reportConfig, bbox: string, cityBBox: string): Vision[] {
    const visionsData = reportConfig.visions;
    const visions: Vision[] = [];
    visionsData.forEach((visionData: Vision) => {
      let image = visionData.image;
      const currentDateInput = JSON.parse(localStorage.getItem('dateFilter'));
      image = this.replaceWildCards(
        image,
          [
            '{bbox}',
            '{citybbox}',
            '{cityCqlFilter}',
            '{propertyCqlFilter}',
            '{carRegister}',
            '{date}'
          ],
          [
            bbox,
            cityBBox,
            `municipio='${propertyData.city}';numero_do2='${propertyData.register}'`,
            `numero_do2='${propertyData.register}'`,
            `'${propertyData.register}'`,
            `${currentDateInput[0]}/${currentDateInput[1]}`
          ]
      );

      const vision = new Vision(
        visionData.id,
        visionData.title,
        image,
        visionData.description,
        visionData.layerData
      );
      visions.push(vision);
    });
    return visions;
  }

  getDetailedVisions(propertyData: Property, reportConfig, bbox: string, cityBBox: string): Vision[] {
    const detailedVisions: Vision[] = [];
    const detailedVisionsData = reportConfig.detailedVisions;
    detailedVisionsData.forEach((detailedVisionData: Vision) => {
      let image = detailedVisionData.image;
      const currentDateInput = JSON.parse(localStorage.getItem('dateFilter'));

      image = this.replaceWildCards(
        image,
          [
            '{bbox}',
            '{propertyCqlFilter}',
            '{carRegister}',
            '{date}'
          ],
          [
            bbox,
            `numero_do2='${propertyData.register}'`,
            `'${propertyData.register}'`,
            `${currentDateInput[0]}/${currentDateInput[1]}`
          ]
      );

      const vision = new Vision(
        detailedVisionData.id,
        detailedVisionData.title,
        image,
        detailedVisionData.description,
        detailedVisionData.layerData
      );
      detailedVisions.push(vision);
    });
    return detailedVisions;
  }

  getDeforestations(propertyData: Property, reportConfig, bbox: string): Vision[] {
    const deforestations: Vision[] = [];
    const deforestationsData = reportConfig.deforestations;
    deforestationsData.forEach((deforestationData: Vision) => {
      let image = deforestationData.image;
      const currentDateInput = JSON.parse(localStorage.getItem('dateFilter'));
      image = this.replaceWildCards(
        image,
          [
            '{bbox}',
            '{propertyCqlFilter}',
            '{carRegister}',
            '{date}'
          ],
          [
            bbox,
            `numero_do2='${propertyData.register}'`,
            `'${propertyData.register}'`,
            `${currentDateInput[0]}/${currentDateInput[1]}`
          ]
      );
      const vision = new Vision(
        deforestationData.id,
        deforestationData.title,
        image,
        deforestationData.description,
        deforestationData.layerData
      );
      deforestations.push(vision);
    });
    return deforestations;
  }

  getDeforestationHistories(propertyData: Property, reportConfig, bbox: string): Vision[] {
    const deforestationHistories: Vision[] = [];
    const deforestationHistoriesData = reportConfig.deforestationHistories;
    deforestationHistoriesData.forEach((deforestationHistoryData: Vision) => {
      let image = deforestationHistoryData.image;
      const currentDateInput = JSON.parse(localStorage.getItem('dateFilter'));

      image = this.replaceWildCards(
        image,
          [
            '{bbox}',
            '{propertyCqlFilter}',
            '{carRegister}',
            '{date}'
          ],
          [
            bbox,
            `numero_do2='${propertyData.register}'`,
            `'${propertyData.register}'`,
            `${currentDateInput[0]}/${currentDateInput[1]}`
          ]
      );
      const vision = new Vision(
        deforestationHistoryData.id,
        deforestationHistoryData.title,
        image,
        deforestationHistoryData.description,
        deforestationHistoryData.layerData
      );
      deforestationHistories.push(vision);
    });
    return deforestationHistories;
  }

  getBurningSpotlights(propertyData: Property, reportConfig, bbox: string): Vision[] {
    const burningSpotlights: Vision[] = [];
    const burningSpotlightsData = reportConfig.burningSpotlights;
    burningSpotlightsData.forEach((burningSpotlightData: Vision) => {
      let image = burningSpotlightData.image;
      const currentDateInput = JSON.parse(localStorage.getItem('dateFilter'));

      image = this.replaceWildCards(
        image,
          [
            '{bbox}',
            '{propertyCqlFilter}',
            '{carRegister}',
            '{date}'
          ],
          [
            bbox,
            `numero_do2='${propertyData.register}'`,
            `'${propertyData.register}'`,
            `${currentDateInput[0]}/${currentDateInput[1]}`
          ]
      );
      const vision = new Vision(
        burningSpotlightData.id,
        burningSpotlightData.title,
        image,
        burningSpotlightData.description,
        burningSpotlightData.layerData
      );
      burningSpotlights.push(vision);
    });
    return burningSpotlights;
  }

  getBurningSpotlightsChart(burningSpotlightsData) {
    const burningSpotlightsYears = [];
    const burningSpotlights = [];
    burningSpotlightsData.forEach(burningSpotlightData => {
      const focusCount = burningSpotlightData['focuscount'];
      const year = burningSpotlightData['year'];
      burningSpotlightsYears.push(year);
      burningSpotlights.push(focusCount);
    });

    const burningSpotlightsChartData = {
      labels: burningSpotlightsYears,
      datasets: [
          {
              label: 'Focos',
              backgroundColor: [
                '#4BC0C0',
                '#FFCE56',
                '#aa7900',
                '#36A2EB',
                '#FF6384'
              ],
              data: burningSpotlights
          }
      ]
    };
    return burningSpotlightsChartData;
  }

  getBurnedAreas(propertyData: Property, reportConfig, bbox: string): Vision[] {
    const burnedAreas: Vision[] = [];
    const burnedAreasData = reportConfig.burnedAreas;
    burnedAreasData.forEach((burnedAreaData: Vision) => {
      let image = burnedAreaData.image;
      const currentDateInput = JSON.parse(localStorage.getItem('dateFilter'));

      image = this.replaceWildCards(
        image,
          [
            '{bbox}',
            '{propertyCqlFilter}',
            '{carRegister}',
            '{date}'
          ],
          [
            bbox,
            `numero_do2='${propertyData.register}'`,
            `'${propertyData.register}'`,
            `${currentDateInput[0]}/${currentDateInput[1]}`
          ]
      );
      const vision = new Vision(
        burnedAreaData.id,
        burnedAreaData.title,
        image,
        burnedAreaData.description,
        burnedAreaData.layerData
      );
      burnedAreas.push(vision);
    });
    return burnedAreas;
  }

  getBurnedAreasChart(burnedAreasData) {
    const burnedAreasYears = [];
    const burnedAreas = [];
    burnedAreasData.forEach(burnedAreaData => {
      const focusCount = burnedAreaData['focuscount'];
      const year = burnedAreaData['year'];
      burnedAreasYears.push(year);
      burnedAreas.push(focusCount);
    });

    return  {
      labels: burnedAreasYears,
      datasets: [
          {
              label: 'Focos',
              backgroundColor: [
                '#FF6384',
                '#4BC0C0',
                '#FFCE56',
                '#aa7900',
                '#36A2EB'
              ],
              data: burnedAreas
          }
      ]
    };
  }

  getBurnedAreasPerPropertyChart(burnedAreasData, propertyArea) {
    const burnedAreasPerPropertyChartDatas = [];
    const burnedAreasPerProperty = [];
    burnedAreasData.forEach(burnedAreaData => {
      const focusCount = burnedAreaData['focuscount'];
      burnedAreasPerProperty.push([propertyArea, focusCount]);
    });

    burnedAreasPerProperty.forEach(burnedArea => {
      const chartData = {
        labels: ['Área imóvel', 'Área queimada'],
        datasets: [
            {
                backgroundColor: [
                  '#FF6384',
                  '#4BC0C0',
                  '#FFCE56',
                  '#aa7900',
                  '#36A2EB'
                ],
                data: burnedArea
            }
        ]
      };
      burnedAreasPerPropertyChartDatas.push(chartData);
    });
    return burnedAreasPerPropertyChartDatas;
  }

  getLandsatHistories(propertyData: Property, reportConfig, bbox: string): Vision[] {
    const landsatHistories: Vision[] = [];
    const landsatHistoriesData = reportConfig.landsatHistories;
    landsatHistoriesData.forEach((landsatHistoryData: Vision) => {
      let image = landsatHistoryData.image;
      const currentDateInput = JSON.parse(localStorage.getItem('dateFilter'));

      image = this.replaceWildCards(
        image,
        [
          '{bbox}',
          '{propertyCqlFilter}',
          '{carRegister}',
          '{date}'
        ],
        [
          bbox,
          `numero_do2='${propertyData.register}'`,
          `'${propertyData.register}'`,
          `${currentDateInput[0]}/${currentDateInput[1]}`
        ]
      );
      const vision = new Vision(
        landsatHistoryData.id,
        landsatHistoryData.title,
        image,
        landsatHistoryData.description,
        landsatHistoryData.layerData
      );
      landsatHistories.push(vision);
    });
    return landsatHistories;
  }

  replaceWildCards(text: string, wildCards: string|string[], replaceValues: string|string[]) {
    if (!Array.isArray(wildCards)) {
      wildCards = [wildCards];
    }
    if (!Array.isArray(replaceValues)) {
      replaceValues = [replaceValues];
    }
    const wildCardLength = wildCards.length;
    for (let index = 0; index < wildCardLength; index++) {
      const wildCard = wildCards[index];
      const replaceValue = replaceValues[index];

      text = text.replace(new RegExp(wildCard, 'g'), replaceValue);
    }
    return text;
  }
}
