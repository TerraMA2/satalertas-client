import {Injectable} from '@angular/core';

import {Property} from '../models/property.model';

import {Subject} from 'rxjs';

import {Vision} from '../models/vision.model';

import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';
import Chart from 'chart.js';

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    URL_REPORT_SERVER = environment.reportServerUrl + '/report';

    property = new Subject<Property>();

    changeReportType = new Subject();

    constructor(
        private http: HttpClient
    ) {
    }

    async getPointsAlerts(carRegister, date, filter, type) {
        const url = `${this.URL_REPORT_SERVER}/getPointsAlerts`;

        const parameters = {carRegister, date, filter, type};

        return await this.http.get(url, {params: parameters}).toPromise();
    }

    async getSynthesisCarData(carRegister, date, filter) {
        const url = `${this.URL_REPORT_SERVER}/getSynthesisCarData`;

        const parameters = {carRegister, date, filter};

        return await this.http.get(url, {params: parameters}).toPromise();
    }

    async createPdf(reportData) {
        const url = this.URL_REPORT_SERVER + '/createPdf';
        const parameters = {reportData};

        return await this.http.post(url, {params: parameters}).toPromise();
    }


    async generatePdf(reportData) {
        const url = this.URL_REPORT_SERVER + '/generatePdf';
        const parameters = {reportData};

        return await this.http.post(url, {params: parameters}).toPromise();
    }

    async newNumber(type) {
        const url = this.URL_REPORT_SERVER + '/newNumber';
        const parameters = {type};

        return await this.http.get(url, {params: parameters}).toPromise();
    }

    async getReportsByCARCod(carCode) {
        const url = this.URL_REPORT_SERVER + '/getReportsByCARCod';
        const parameters = {carCode};

        return await this.http.get(url, {params: parameters}).toPromise();
    }

    async getReportById(id) {
        const url = this.URL_REPORT_SERVER;
        const parameters = {id};

        return await this.http.get(url, {params: parameters}).toPromise();
    }

    getVisions(propertyData: Property, visionsData, key: string = null): Vision[] {
        let visions: Vision[] = [];
        if (key) {
            visions = this.getDynamicVisions(propertyData, visionsData, key);
        } else {
            visionsData.forEach((visionData: Vision, index) => visions.push(this.getVision(visionData, propertyData, index)));
        }
        return visions;
    }

    getDynamicVisions(propertyData: Property, visionsData, key: string) {
        const visions: Vision[] = [];
        const visionData = visionsData[0];
        const years = propertyData[key];

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
                area = date.area;
                spotlights = Number(date.spotlights);
                burnedAreas = date.burnedareas;
                if (!area) {
                    area = 0.0000;
                }

                if (!spotlights) {
                    spotlights = 0.0000;
                }
                if (!burnedAreas) {
                    burnedAreas = 0.0000;
                }
                count++;
            } else {
                area = 0.0000;
                spotlights = 0.0000;
                burnedAreas = 0.0000;
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

    getVision(visionData: Vision, propertyData: Property, index = null): Vision {
        const image = this.generateImageURL(propertyData, visionData);

        const filterDate = JSON.parse(localStorage.getItem('dateFilter'));

        const startDate = new Date(filterDate[0]).toLocaleDateString('pt-BR');
        const endDate = new Date(filterDate[1]).toLocaleDateString('pt-BR');

        const title = this.replaceWildCards(
            visionData.title,
            [
                '{currentYear}',
                '{break}',
                '{filterDate}',
                '{emptyLine}'
            ],
            [
                new Date().getFullYear().toString(),
                `<br />`,
                `${startDate} - ${endDate}`,
                `<br />`
            ]
        );
        let descriptionValue;
        let visionDescription = visionData.description;
        if (visionDescription) {
            if (typeof visionDescription !== 'object') {
                descriptionValue = visionData.description;
            } else {
                descriptionValue = this.replaceWildCards(
                    visionData.description['value'],
                    [
                        '{indigenousLand}',
                        '{conservationUnit}',
                        '{legalReserve}',
                        '{app}',
                        '{anthropizedUse}',
                        '{nativeVegetation}',
                        '{prodesArea}'
                    ],
                    [
                        propertyData.indigenousLand['area'] ? propertyData.indigenousLand['area'] : '0.0000',
                        propertyData.conservationUnit['area'] ? propertyData.conservationUnit['area'] : '0.0000',
                        propertyData.legalReserve['area'] ? propertyData.legalReserve['area'] : '0.0000',
                        propertyData.app['area'] ? propertyData.app['area'] : '0.0000',
                        propertyData.anthropizedUse['area'] ? propertyData.anthropizedUse['area'] : '0.0000',
                        propertyData.nativeVegetation['area'] ? propertyData.nativeVegetation['area'] : '0.0000',
                        propertyData['prodesYear'][index] ? propertyData['prodesYear'][index]['area'] : '0.0000',
                    ]
                );
            }
            visionDescription = {
                text: visionData.description['text'],
                value: descriptionValue
            };
        }


        return new Vision(
            title,
            image,
            visionDescription,
            visionData.carRegisterColumn,
            visionData.layerData
        );
    }

    getBurningSpotlightsChart(burningSpotlightsData) {
        const burningSpotlightsYears = [];
        const burningSpotlights = [];
        burningSpotlightsData.forEach(burningSpotlightData => {
            const focusCount = burningSpotlightData.spotlights;
            const year = burningSpotlightData.date;
            burningSpotlightsYears.push(year);
            burningSpotlights.push(focusCount);
        });

        return this.getChart('Focos', burningSpotlightsYears, burningSpotlights);
    }

    getBurnedAreasChart(burnedAreasData) {
        const burnedAreasYears = [];
        const burnedAreas = [];
        burnedAreasData.forEach(burnedAreaData => {
            const burnedArea = Number(burnedAreaData.area);
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
            const historyDeterArea = Number(historyDeter.area);
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
            const historyProdesArea = Number(historyProdes.area);
            const year = historyProdes.date;
            historyProdesYears.push(year);
            historyProdesAreas.push(historyProdesArea);
        });

        return this.getChart('PRODES', historyProdesYears, historyProdesAreas);
    }

    private getChart(legends: string | string[], labels: string | string[], data) {
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

        const bbox = propertyData.bbox;

        const cityBBox = propertyData.citybbox;

        const stateBBox = propertyData.statebbox;

        const wildCards = [
            '{bbox}',
            '{citybbox}',
            '{statebbox}',
            '{cityCqlFilter}',
            '{mosaicCqlFilter}',
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
            stateBBox,
            `municipio='${propertyData.city}';rid='${propertyData.gid}'`,
            `RED_BAND>0`,
            `${date[0]}/${date[1]}`
        ];
        if (carRegisterColumn) {
            const carRegisterColumnArr = carRegisterColumn.split(';');
            carRegisterColumnArr.forEach(column => replaceValues.push(`${column}='${propertyData.gid}'`));
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
        const styles = layerData.styles;

        url += `&layers=${layers}&bbox=${bbox}&width=${width}&height=${height}`;
        if (styles) {
            url += `&styles=${styles}`;
        }
        if (layerData.time) {
            url += `&time=${layerData.time}`;
        }
        if (layerData.cql_filter) {
            url += `&cql_filter=${layerData.cql_filter}`;
        }
        url += `&srs=${srs}&format=${format}`;
        return url;
    }

    private replaceWildCards(text: string, wildCards: string | string[], replaceValues: string | string[], regexFlag = '') {
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

    generateChart(labels, burnData) {
        const canvas: any = document.createElement('canvas');
        const prohibitivePeriodColor = 'rgba(255,5,0,1)';
        const allBurningColor = 'rgba(5,177,0,1)';
        const burnLightData = burnData[0].data;
        const prohibitivePeriod = burnData[1].data;
        const burnTitle = burnData[0].title;
        const prohibitivePeriodTitle = burnData[1].title;

        canvas.setAttribute('width', 600);
        canvas.setAttribute('height', 200);
        canvas.setAttribute('style', 'display: none');

        document.body.appendChild(canvas);

        const ctx: any = canvas.getContext('2d');
        const options = {
            type: 'bar',
            data: {
                labels,
                lineColor: 'rgb(10,5,109)',
                datasets: [
                    {
                        label: burnTitle,
                        data: burnLightData,
                        backgroundColor: allBurningColor,
                    },
                    {
                        label: prohibitivePeriodTitle,
                        data: prohibitivePeriod,
                        backgroundColor: prohibitivePeriodColor,
                    },
                ]
            },
            options: {
                responsive: false,
                legend: {
                    display: true
                }
            }
        };

        const chart = new Chart(ctx, options);

        chart.update({
            duration: 0,
            lazy: false,
            easing: 'easeOutBounce'
        });

        chart.render();
        chart.stop();

        return chart;
    }
}
