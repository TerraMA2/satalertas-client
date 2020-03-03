import { Injectable } from '@angular/core';

import { Property } from '../models/property.model';

import { Subject } from 'rxjs';

import { Vision } from '../models/vision.model';

import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  URL_REPORT_SERVER = environment.reportServerUrl + '/report';

  property = new Subject<Property>();

  changeReportType = new Subject();

  constructor(
    private http: HttpClient
  ) { }

  async getPointsAlerts(carRegister, date, filter, type) {
    const url = `${this.URL_REPORT_SERVER}/getPointsAlerts`;

    const parameters = {carRegister, date, filter, type };

    return await this.http.get(url, { params: parameters }).toPromise();
  }

  async getSynthesisCarData(carRegister, date, filter) {
    const url = `${this.URL_REPORT_SERVER}/getSynthesisCarData`;

    const parameters = {carRegister, date, filter };

    return await this.http.get(url, { params: parameters }).toPromise();
  }

  async generatePdf(docDefinition, type, carCode) {
    const url = this.URL_REPORT_SERVER + '/generatePdf';
    const parameters = { docDefinition, type, carCode };

    return await this.http.post(url, { params: parameters }).toPromise();
  }

  async newNumber(type) {
    const url = this.URL_REPORT_SERVER + '/newNumber';
    const parameters = { type };

    return await this.http.get(url, { params: parameters }).toPromise();
  }

  async getReportsByCARCod(carCode) {
    const url = this.URL_REPORT_SERVER + '/getReportsByCARCod';
    const parameters = { carCode };

    return await this.http.get(url, { params: parameters }).toPromise();
  }

  async getReportById(id) {
    const url = this.URL_REPORT_SERVER;
    const parameters = { id };

    return await this.http.get(url, { params: parameters }).toPromise();
  }

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
    // if (!years || years.length === 0) {
    //   years.push({date: '2007'});
    //   years.push({date: (new Date()).getFullYear()});
    // }

    const title = visionData.title;
    const time = visionData.layerData.time;
    const description = visionData.description;

    const periodKey = propertyData.analysisPeriod[key] ? key :
      key.includes('prodes') ? 'prodesYear' :
      key.includes('deter') ? 'deterYear' :
      key.includes('burnedArea') ? 'burnedAreaYear' :
      key.includes('spotlights') ? 'spotlightsYear' : '';


    let startYear = propertyData.analysisPeriod[periodKey].startYear;
    const endYear = propertyData.analysisPeriod[periodKey].endYear;

    let count = 0;
    while (startYear <= endYear) {
      const visionDataCopy = JSON.parse(JSON.stringify(visionData));
      const date = years[count];
      let area = null;
      let spotlights = null;
      let burnedAreas = null;
      const year = startYear;

      if (date && date.date === year) {
        area = (Number(date.area));
        spotlights = (Number(date.spotlights));
        burnedAreas = (Number(date.burnedareas));
        if (!area) {
          area = 0;
        }

        if (!spotlights) {
          spotlights = 0;
        }
        if (!burnedAreas) {
          burnedAreas = 0;
        }
        count++;
      } else {
        area = 0;
        spotlights = 0;
        burnedAreas = 0;
      }
      const replacedTitle = this.replaceWildCard(title, '{year}', year);
      const replacedDescriptionText = this.replaceWildCard(description.text, '{year}', year);
      const replacedDescriptionValue = this.replaceWildCards(description.value, ['{area}', '{spotlights}', '{burnedAreas}'], [area, spotlights, burnedAreas]);
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
      visionData.carRegisterColumn,
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
      const burnedArea = burnedAreaData.burnedareas;
      const year = burnedAreaData.date;
      burnedAreasYears.push(year);
      burnedAreas.push(burnedArea);
    });

    return this.getChart('Área queimada', burnedAreasYears, burnedAreas);
  }

  getBurnedAreasPerPropertyChart(burnedAreasData, propertyArea) {
    const burnedAreasPerPropertyChartDatas = [];
    const burnedAreasPerProperty = [];
    burnedAreasData.forEach(burnedAreaData => burnedAreasPerProperty.push([propertyArea, burnedAreaData.burnedareas]));

    burnedAreasPerProperty.forEach(burnedArea => {
      burnedAreasPerPropertyChartDatas.push(this.getChart(null, ['Área imóvel', 'Área queimada'], burnedArea));
    });
    return burnedAreasPerPropertyChartDatas;
  }

  getHistoryDeterChart(historyDeterData) {
    const historyDeterYears = [];
    const historyDeterAreas = [];
    historyDeterData.forEach(historyDeter => {
      const historyDeterArea = historyDeter.area;
      const year = historyDeter.date;
      historyDeterYears.push(year);
      historyDeterAreas.push(historyDeterArea);
    });

    return this.getChart('DETER', historyDeterYears, historyDeterAreas);
  }

  getHistoryProdesChart(historyProdesData) {
    const historyProdesYears = [];
    const historyProdesAreas = [];
    historyProdesData.forEach(historyProdes => {
      const historyProdesArea = historyProdes.area;
      const year = historyProdes.date;
      historyProdesYears.push(year);
      historyProdesAreas.push(historyProdesArea);
    });

    return this.getChart('PRODES', historyProdesYears, historyProdesAreas);
  }

  private getChart(legends: string|string[], labels: string|string[], data) {
    if (!Array.isArray(labels)) {
      labels = [labels];
    }
    const backgroundColors = [];
    labels.forEach(label => backgroundColors.push('#' + Math.floor(Math.random() * 16777215).toString(16)));
    return {
      labels,
      datasets: [
          {
              label: legends,
              backgroundColor: backgroundColors,
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
    const carRegisterColumn = visionData.carRegisterColumn;
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
    if (carRegisterColumn) {
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
    if (carRegisterColumn) {
      const carRegisterColumnArr = carRegisterColumn.split(';');
      carRegisterColumnArr.forEach(column => replaceValues.push(`${column}='${propertyData.register}'`));
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
