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

  getVisions(propertyData: Property, visionsData, key: string = null): Vision[] {
    let visions: Vision[] = [];
    if (key) {
      visions = this.getDynamicVisions(propertyData, visionsData, key);
    } else {
      visionsData.forEach((visionData: Vision) => visions.push(this.getVision(visionData, propertyData)));
    }
    return visions;
  }

  getDynamicVisions(propertyData: Property, visionsData, key: string) {
    const visions: Vision[] = [];
    const visionData = visionsData[0];
    const years = propertyData[key];
    const time = visionData.layerData.time;
    const title = visionData.title;
    years.forEach((y) => {
      const visionDataCopy = new Vision(
        visionData.title,
        visionData.image,
        visionData.description,
        visionData.registerCarColumn,
        visionData.layerData
      );
      const year = (Number(y.date));
      const replacedTitle = this.replaceWildCard(title, '{year}', year);
      let timeReplaced = this.replaceWildCard(time, '{dateYear}', (year + 1));
      timeReplaced = this.replaceWildCard(timeReplaced, '{year}', 'P1Y');
      visionDataCopy.layerData.time = timeReplaced;
      visionDataCopy.title = replacedTitle;
      visions.push(this.getVision(visionDataCopy, propertyData));
    });
    return visions;
  }

  getVision(visionData: Vision, propertyData: Property): Vision {
    const image = this.generateImageURL(propertyData, visionData);

    const title = this.replaceWildCards(visionData.title, '{currentYear}', new Date().getFullYear().toString());

    const vision = new Vision(
      title,
      image,
      visionData.description,
      visionData.registerCarColumn,
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

  private getChart(legends: string|string[], labels: string|string[], data) {
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

  private generateImageURL(propertyData, visionData) {
    let url = this.getUrl(visionData);
    url = this.replaceURLWildCards(url, propertyData, visionData);
    return url;
  }

  private replaceURLWildCards(text, propertyData: Property, visionData: Vision) {
    const registerCarColumn = visionData.registerCarColumn;
    const date = JSON.parse(localStorage.getItem('dateFilter'));

    const bboxArray = propertyData.bbox.split(',');
    const bbox = bboxArray[0].split(' ').join(',') + ',' + bboxArray[1].split(' ').join(',');

    const cityBBoxArray = propertyData.citybbox.split(',');
    const cityBBox = cityBBoxArray[0].split(' ').join(',') + ',' + cityBBoxArray[1].split(' ').join(',');

    const wildCards = [
      '{bbox}',
      '{citybbox}',
      '{cityCqlFilter}',
      '{filterDate}'
    ];
    const cqlFilter = visionData.layerData['cql_filter'];
    if (registerCarColumn) {
      const cqlFilterArr = cqlFilter.split(';');
      cqlFilterArr.forEach((propertyCqlFilterWildCard: string) => {
        const startBracket = propertyCqlFilterWildCard.indexOf('{');
        const endBracket = propertyCqlFilterWildCard.indexOf('}');
        wildCards.push(propertyCqlFilterWildCard.substring(startBracket, (endBracket + 1)));
      });
    }
    const replaceValues = [
      bbox,
      cityBBox,
      `municipio='${propertyData.city}';numero_do2='${propertyData.register}'`,
      `${date[0]}/${date[1]}`
    ];
    if (registerCarColumn) {
      const registerCarColumnArr = registerCarColumn.split(';');
      registerCarColumnArr.forEach(column => replaceValues.push(`${column}='${propertyData.register}'`));
    }
    return this.replaceWildCards(text, wildCards, replaceValues);
  }

  private getUrl(visionData) {
    const layerData = visionData.layerData;
    let url = layerData.url;
    const layers = layerData.layers;
    const format = layerData.format;
    const time = layerData.time;
    const cqlFilter = layerData['cql_filter'];
    const bbox = layerData.bbox;
    const width = layerData.width;
    const height = layerData.height;
    const srs = layerData.srs;

    url += `&layers=${layers}&styles=&bbox=${bbox}&width=${width}&height=${height}&time=${time}&cql_filter=${cqlFilter}&srs=${srs}&format=${format}`;
    return url;
  }

  private replaceWildCards(text: string, wildCards: string|string[], replaceValues: string|string[], regexFlag = '') {
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

      text = this.replaceWildCard(text, wildCard, replaceValue, regexFlag);
    }
    return text;
  }

  private replaceWildCard(text, wildCard, replaceValue, regexFlag = '') {
    return text.replace(new RegExp(wildCard, regexFlag), replaceValue);
  }

}
