import { Injectable } from '@angular/core';

import { Property } from '../models/property.model';

import { Subject } from 'rxjs';

import { Vision } from '../models/vision.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  property = new Subject<Property>();

  constructor( ) {}

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
    if (!years || years.length === 0) {
      years.push({date: '2007'});
      years.push({date: '2019'});
    }

    const title = visionData.title;
    const time = visionData.layerData.time;
    const description = visionData.description;

    let startYear = (years[0]).date;
    let endYear = (years[years.length - 1]).date;
    if (!endYear || startYear === endYear) {
      endYear = (new Date()).getFullYear();
    }
    let count = 0;
    while (startYear <= endYear) {
      const visionDataCopy = JSON.parse(JSON.stringify(visionData));
      // const visionDataCopy = new Vision(
      //   visionData.title,
      //   visionData.image,
      //   visionData.description,
      //   visionData.registerCarColumn,
      //   visionData.layerData
      // );
      const date = years[count];
      let area = null;
      let spotlights = null;
      const year = startYear;

      if (date && date.date === year) {
        area = (Number(date.area));
        spotlights = (Number(date.spotlights));
        if (!area) {
          area = 0;
        }

        if (!spotlights) {
          spotlights = 0;
        }
        count++;
      } else {
        area = 0;
        spotlights = 0;
      }
      const replacedTitle = this.replaceWildCard(title, '{year}', year);
      const replacedDescriptionText = this.replaceWildCard(description.text, '{year}', year);
      const replacedDescriptionValue = this.replaceWildCards(description.value, ['{area}', '{spotlights}'], [area, spotlights]);
      const timeReplaced = this.replaceWildCards(time, ['{dateYear}', '{year}'], [year, 'P1Y']);
      visionDataCopy.title = replacedTitle;
      visionDataCopy.description = {
        text: replacedDescriptionText,
        value: replacedDescriptionValue
      };
      visionDataCopy.layerData.time = timeReplaced;
      visions.push(this.getVision(visionDataCopy, propertyData));
      startYear++;
    }
    return visions;
  }

  getVision(visionData: Vision, propertyData: Property): Vision {
    const image = this.generateImageURL(propertyData, visionData);

    const filterDate = JSON.parse(localStorage.getItem('dateFilter'));
    const startDate = new Date(filterDate[0]).toLocaleDateString('pt-BR');
    const endDate = new Date(filterDate[1]).toLocaleDateString('pt-BR');

    const title = this.replaceWildCards(
      visionData.title,
      [
        '{currentYear}',
        '{break}',
        '{filterDate}'
      ],
      [
        new Date().getFullYear().toString(),
        `<br />`,
        `${startDate} - ${endDate}`
      ]
    );
    let descriptionValue;
    let visionDescription;
    if (visionData.description) {
      descriptionValue = this.replaceWildCards(
        visionData.description['value'],
        [
          '{indigenousLand}',
          '{conservationUnit}',
          '{legalReserve}',
          '{app}',
          '{consolidatedArea}',
          '{anthropizedUse}',
          '{nativeVegetation}',
        ],
        [
          propertyData.indigenousLand['area'] ? propertyData.indigenousLand['area'] : 0,
          propertyData.conservationUnit['area'] ? propertyData.conservationUnit['area'] : 0,
          propertyData.legalReserve['area'] ? propertyData.legalReserve['area'] : 0,
          propertyData.app['area'] ? propertyData.app['area'] : 0,
          propertyData.consolidatedArea['area'] ? propertyData.consolidatedArea['area'] : 0,
          propertyData.anthropizedUse['area'] ? propertyData.anthropizedUse['area'] : 0,
          propertyData.nativeVegetation['area'] ? propertyData.nativeVegetation['area'] : 0
        ]
      );

      visionDescription = {
        text: visionData.description['text'],
        value: descriptionValue
      };
    }

    const vision = new Vision(
      title,
      image,
      visionDescription,
      visionData.registerCarColumn,
      visionData.layerData
    );
    return vision;
  }

  getBurningSpotlightsChart(burningSpotlightsData) {
    const burningSpotlightsYears = [];
    const burningSpotlights = [];
    burningSpotlightsData.forEach(burningSpotlightData => {
      const focusCount = burningSpotlightData.focuscount;
      const year = burningSpotlightData.year;
      burningSpotlightsYears.push(year);
      burningSpotlights.push(focusCount);
    });

    return this.getChart('Focos', burningSpotlightsYears, burningSpotlights);
  }

  getBurnedAreasChart(burnedAreasData) {
    const burnedAreasYears = [];
    const burnedAreas = [];
    burnedAreasData.forEach(burnedAreaData => {
      const focusCount = burnedAreaData.focuscount;
      const year = burnedAreaData.year;
      burnedAreasYears.push(year);
      burnedAreas.push(focusCount);
    });

    return this.getChart('Focos', burnedAreasYears, burnedAreas);
  }

  getBurnedAreasPerPropertyChart(burnedAreasData, propertyArea) {
    const burnedAreasPerPropertyChartDatas = [];
    const burnedAreasPerProperty = [];
    burnedAreasData.forEach(burnedAreaData => {
      const focusCount = burnedAreaData.focuscount;
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
      `municipio='${propertyData.city}';numero_do1='${propertyData.register}'`,
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
    const bbox = layerData.bbox;
    const width = layerData.width;
    const height = layerData.height;
    const srs = layerData.srs;

    url += `&layers=${layers}&styles=&bbox=${bbox}&width=${width}&height=${height}`;
    if (layerData.time) {
      url += `&time=${layerData.time}`;
    }
    if (layerData.cql_filter) {
      url += `&cql_filter=${layerData.cql_filter}`;
    }
    url += `&srs=${srs}&format=${format}`;
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

  private replaceWildCard(text: string, wildCard: string, replaceValue: string, regexFlag: string = '') {
    return text.replace(new RegExp(wildCard, regexFlag), replaceValue);
  }
}
