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

  getVisions(propertyData: Property, visionsData): Vision[] {
    const visions: Vision[] = [];
    visionsData.forEach((visionData: Vision) => visions.push(this.getVision(visionData, propertyData)));
    return visions;
  }

  getVision(visionData: Vision, propertyData: Property): Vision {
    const layerData = visionData.layerData;

    const image = this.generateImageURL(propertyData, layerData);

    const vision = new Vision(
      visionData.title,
      image,
      visionData.description,
      visionData.layerData
    );
    return vision;
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

    return this.getChart('Focos', burningSpotlightsYears, burningSpotlights);
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

    return this.getChart('Focos', burnedAreasYears, burnedAreas);
  }

  getChart(legends: string|string[], labels: string|string[], data) {
    return {
      labels,
      datasets: [
          {
              label: legends,
              backgroundColor: [
                '#4BC0C0',
                '#FFCE56',
                '#aa7900',
                '#36A2EB',
                '#FF6384'
              ],
              data
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
      burnedAreasPerPropertyChartDatas.push(this.getChart(null, ['Área imóvel', 'Área queimada'], burnedArea));
    });
    return burnedAreasPerPropertyChartDatas;
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

    url +=
      `&layers=${layers}&cql_filter=${cqlFilter}&time=${time}&bbox=${bbox}&width=${width}&height=${height}&srs=${srs}&format=${format}&version=${version}`
    ;

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
