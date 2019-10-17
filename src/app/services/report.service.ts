import { Injectable } from '@angular/core';
7
import { Property } from '../models/property.model';

import { Subject } from 'rxjs';

import { Vision } from '../models/vision.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  property = new Subject<Property>();

  constructor() { }

  getVisions(propertyData: Property, reportConfig): Vision[] {
    const visionsData = reportConfig.visions;
    const visions: Vision[] = [];
    visionsData.forEach((visionData: Vision) => {
      const layerData = visionData.layerData;

      const image = this.generateImageURL(propertyData, layerData);

      const vision = new Vision(
        visionData.title,
        image,
        visionData.description,
        visionData.layerData
      );
      visions.push(vision);
    });
    return visions;
  }

  getDetailedVisions(propertyData: Property, reportConfig): Vision[] {
    const detailedVisions: Vision[] = [];
    const detailedVisionsData = reportConfig.detailedVisions;
    detailedVisionsData.forEach((detailedVisionData: Vision) => {
      const layerData = detailedVisionData.layerData;

      const image = this.generateImageURL(propertyData, layerData);

      const vision = new Vision(
        detailedVisionData.title,
        image,
        detailedVisionData.description,
        detailedVisionData.layerData
      );
      detailedVisions.push(vision);
    });
    return detailedVisions;
  }

  getDeforestations(propertyData: Property, reportConfig): Vision[] {
    const deforestations: Vision[] = [];
    const deforestationsData = reportConfig.deforestations;
    deforestationsData.forEach((deforestationData: Vision) => {
      const layerData = deforestationData.layerData;

      const image = this.generateImageURL(propertyData, layerData);

      const vision = new Vision(
        deforestationData.title,
        image,
        deforestationData.description,
        deforestationData.layerData
      );
      deforestations.push(vision);
    });
    return deforestations;
  }

  getDeforestationHistories(propertyData: Property, reportConfig): Vision[] {
    const deforestationHistories: Vision[] = [];
    const deforestationHistoriesData = reportConfig.deforestationHistories;
    deforestationHistoriesData.forEach((deforestationHistoryData: Vision) => {
      const layerData = deforestationHistoryData.layerData;

      const image = this.generateImageURL(propertyData, layerData);

      const vision = new Vision(
        deforestationHistoryData.title,
        image,
        deforestationHistoryData.description,
        deforestationHistoryData.layerData
      );
      deforestationHistories.push(vision);
    });
    return deforestationHistories;
  }

  getBurningSpotlights(propertyData: Property, reportConfig): Vision[] {
    const burningSpotlights: Vision[] = [];
    const burningSpotlightsData = reportConfig.burningSpotlights;
    burningSpotlightsData.forEach((burningSpotlightData: Vision) => {
      const layerData = burningSpotlightData.layerData;

      const image = this.generateImageURL(propertyData, layerData);

      const vision = new Vision(
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

  getBurnedAreas(propertyData: Property, reportConfig): Vision[] {
    const burnedAreas: Vision[] = [];
    const burnedAreasData = reportConfig.burnedAreas;
    burnedAreasData.forEach((burnedAreaData: Vision) => {
      const layerData = burnedAreaData.layerData;

      const image = this.generateImageURL(propertyData, layerData);

      const vision = new Vision(
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

  getLandsatHistories(propertyData: Property, reportConfig): Vision[] {
    const landsatHistories: Vision[] = [];
    const landsatHistoriesData = reportConfig.landsatHistories;
    landsatHistoriesData.forEach((landsatHistoryData: Vision) => {
      const layerData = landsatHistoryData.layerData;

      const image = this.generateImageURL(propertyData, layerData);

      const vision = new Vision(
        landsatHistoryData.title,
        image,
        landsatHistoryData.description,
        landsatHistoryData.layerData
      );
      landsatHistories.push(vision);
    });
    return landsatHistories;
  }

  getUrl(layerData) {
    let url = layerData.url;
    const layers = layerData.layers;
    const format = layerData.format;
    const version = layerData.version;
    const time = layerData.time;
    const cqlFilter = layerData['cql_filter'];
    const bbox = layerData.bbox;
    const width = layerData.width;
    const height = layerData.height;
    const srs = layerData.srs;

    url += `&layers=${layers}&cql_filter=${cqlFilter}&time=${time}&bbox=${bbox}&width=${width}&height=${height}&srs=${srs}&format=${format}&version=${version}`;

    return url;
  }

  replaceWildCards(text: string, propertyData: Property) {
    const date = JSON.parse(localStorage.getItem('dateFilter'));

    const bboxArray = propertyData.bbox.split(',');
    const bbox = bboxArray[0].split(' ').join(',') + ',' + bboxArray[1].split(' ').join(',');

    const cityBBoxArray = propertyData.citybbox.split(',');
    const cityBBox = cityBBoxArray[0].split(' ').join(',') + ',' + cityBBoxArray[1].split(' ').join(',');

    const wildCards = [
      '{bbox}',
      '{citybbox}',
      '{cityCqlFilter}',
      '{propertyCqlFilter}',
      '{date}'
    ];
    const replaceValues = [
      bbox,
      cityBBox,
      `municipio='${propertyData.city}';numero_do2='${propertyData.register}'`,
      `numero_do2='${propertyData.register}'`,
      `${date[0]}/${date[1]}`
    ];
    const wildCardLength = wildCards.length;
    for (let index = 0; index < wildCardLength; index++) {
      const wildCard = wildCards[index];
      const replaceValue = replaceValues[index];

      text = text.replace(new RegExp(wildCard, 'g'), replaceValue);
    }
    return text;
  }

  generateImageURL(propertyData, layerData) {
    let url = this.getUrl(layerData);
    url = this.replaceWildCards(url, propertyData);
    return url;
  }
}
