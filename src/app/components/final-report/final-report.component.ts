import {AfterViewInit, Component, Inject, LOCALE_ID, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';

import {SidebarService} from 'src/app/services/sidebar.service';

import {ReportService} from '../../services/report.service';

import {Response} from 'src/app/models/response.model';

import pdfMake from 'pdfmake/build/pdfmake';

import Chart from 'chart.js';

import pdfFonts from 'pdfmake/build/vfs_fonts';
import {FinalReportService} from '../../services/final-report.service';

import {AuthService} from 'src/app/services/auth.service';

import {ConfirmationService, MessageService} from 'primeng-lts/api';

import {Image} from '../../models/image.model';

import {formatNumber} from '@angular/common';

import {User} from '../../models/user.model';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-final-report',
    templateUrl: './final-report.component.html',
    styleUrls: ['./final-report.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [ConfirmationService]
})

export class FinalReportComponent implements OnInit, AfterViewInit {

    @ViewChild('imagem2', {static: false}) imagem2: Chart;
    @ViewChild('chartImg', {static: false}) chartImg: Chart;
    @ViewChild('myChart0', {static: false}) myChart0: Chart;
    @ViewChild('myChart1', {static: false}) myChart1: Chart;
    @ViewChild('myChart2', {static: false}) myChart2: Chart;
    @ViewChild('myChart3', {static: false}) myChart3: Chart;
    @ViewChild('myChart4', {static: false}) myChart4: Chart;
    @ViewChild('myChart5', {static: false}) myChart5: Chart;
    @ViewChild('myChart6', {static: false}) myChart6: Chart;
    @ViewChild('myChart7', {static: false}) myChart7: Chart;
    @ViewChild('myChart8', {static: false}) myChart8: Chart;
    @ViewChild('myChart9', {static: false}) myChart9: Chart;
    @ViewChild('myChart10', {static: false}) myChart10: Chart;
    @ViewChild('myChart11', {static: false}) myChart11: Chart;
    @ViewChild('myChart12', {static: false}) myChart12: Chart;
    @ViewChild('myChart13', {static: false}) myChart13: Chart;
    reportData;
    carRegister: string;
    chartImages = [];
    dateFilter: string;
    formattedFilterDate: string;
    currentYear: number;
    currentDate: string;
    filter;
    date;
    points: any[] = [];
    type: string;
    year: string;
    docDefinition: any;
    docBase64;
    generatingReport = false;
    inputSat: string;
    textAreaComments: string;
    labelTextArea: string;
    loggedUser: User = null;
    formatValueLocate = {
        async prodes(reportData) {
            reportData.property.area = formatNumber(reportData.property.area, 'pt-BR', '1.0-4');
            reportData.property.area_km = formatNumber(reportData.property.area_km, 'pt-BR', '1.0-4');
            reportData.property.areaPastDeforestation = formatNumber(reportData.property.areaPastDeforestation, 'pt-BR', '1.0-4');
            reportData.property.lat = formatNumber(reportData.property.lat, 'pt-BR', '1.0-4');
            reportData.property.long = formatNumber(reportData.property.long, 'pt-BR', '1.0-4');


            reportData.property.prodesTotalArea = formatNumber(reportData.property.prodesTotalArea, 'pt-BR', '1.0-4');
            reportData.property.areaUsoCon = formatNumber(reportData.property.areaUsoCon, 'pt-BR', '1.0-4');
            reportData.property.prodesArea = formatNumber(reportData.property.prodesArea, 'pt-BR', '1.0-4');

            const listPastDeforestation = reportData.property.tableVegRadam.pastDeforestation.split('\n');
            let pastDeforestationStr = '';
            for (const data of listPastDeforestation) {
                const pastDeforestation = data.substring(0, data.indexOf(':'));
                const valuePastDeforestation = formatNumber(data.substring(data.indexOf(':') + 1, data.length), 'pt-BR', '1.0-4');

                pastDeforestationStr = pastDeforestationStr ? `${pastDeforestationStr}\n${pastDeforestation}: ${valuePastDeforestation}` : `${pastDeforestation}: ${valuePastDeforestation}`;
            }
            reportData.property.tableVegRadam.pastDeforestation = pastDeforestationStr;
            for (const data of reportData.prodesTableData) {
                data.area = formatNumber(data.area, 'pt-BR', '1.0-4');
            }
            for (const data of reportData.property.vegRadam) {
                data.area_ha_ = formatNumber(data.area_ha_, 'pt-BR', '1.0-4');
                data.area_ha_car_vegradam = formatNumber(data.area_ha_car_vegradam, 'pt-BR', '1.0-4');
            }
            if (reportData.property.prodesRadam) {
                for (const data of reportData.property.prodesRadam) {
                    data.area = formatNumber(data.area, 'pt-BR', '1.0-4');
                }
            }
            for (const data of reportData.property.deflorestationHistory) {
                data.area = formatNumber(data.area, 'pt-BR', '1.0-4');
            }
            for (const data of reportData.property.tableData) {
                data.pastDeforestation = formatNumber(data.pastDeforestation, 'pt-BR', '1.0-4');
            }
            for (const data of reportData.property.analyzesYear) {
                data.area = formatNumber(data.area, 'pt-BR', '1.0-4');
            }
        },
        async deter(reportData) {
            reportData.property.area = formatNumber(reportData.property.area, 'pt-BR', '1.0-4');
            reportData.property.area_km = formatNumber(reportData.property.area_km, 'pt-BR', '1.0-4');
            reportData.property.areaPastDeforestation = formatNumber(reportData.property.areaPastDeforestation ? reportData.property.areaPastDeforestation : 0, 'pt-BR', '1.0-4');
            reportData.property.lat = formatNumber(reportData.property.lat, 'pt-BR', '1.0-4');
            reportData.property.long = formatNumber(reportData.property.long, 'pt-BR', '1.0-4');

            for (const data of reportData.property.tableData) {
                data.pastDeforestation = formatNumber(data.pastDeforestation, 'pt-BR', '1.0-4');
            }
        },
        async queimada(reportData) {

        }
    };

    constructor(
        private activatedRoute: ActivatedRoute,
        private sidebarService: SidebarService,
        private reportService: ReportService,
        private finalReportService: FinalReportService,
        private authService: AuthService,
        private messageService: MessageService,
        private router: Router,
        private confirmationService: ConfirmationService,
        @Inject(LOCALE_ID) private locale: string
    ) {
    }

    async ngOnInit() {
        this.inputSat = '';
        this.textAreaComments = '';

        this.authService.user.subscribe(user => {
            this.loggedUser = user;
            if (!user) {
                this.router.navigateByUrl('/map');
                this.messageService.add({severity: 'error', summary: 'Atenção!', detail: 'Usuário não autenticado.'});
            }
        });
        this.activatedRoute.params.subscribe(params => {
            this.carRegister = params.carRegister;
            this.labelTextArea = 'Conclusão:';
            this.type = params.type;
        });

        this.reportService.changeReportType.subscribe(() => {
            this.activatedRoute.params.subscribe(params => {
                this.carRegister = params.carRegister;
                this.type = params.type;
                this.ngAfterViewInit();
            });
        });

        this.sidebarService.sidebarLayerShowHide.next(false);

    }

    async ngAfterViewInit() {
        this.filter = localStorage.getItem('filterList');
        this.date = JSON.parse(localStorage.getItem('dateFilter'));

        if (this.type === 'prodes') {
            this.points = await this.reportService.getPointsAlerts(this.carRegister, this.date, this.filter, this.type).then(async (response: Response) => await response.data);
        } else if (this.type === 'queimada') {
            this.points = await this.reportService.getBurnlightCharts(this.carRegister, this.date, this.filter, this.type).then(async (response: Response) => await response.data);
        }
        this.year = new Date().getFullYear().toString();
        await this.setChartNdvi();
    }

    async setChartNdvi() {
        if (this.type === 'prodes') {
            let count = 0;
            for (const point of this.points) {
                const canvas: any = document.createElement('canvas');
                canvas.id = `myChart${count}`;
                canvas.setAttribute('width', 600);
                canvas.setAttribute('height', 200);
                canvas.setAttribute('style', 'display: none');

                document.body.appendChild(canvas);

                const ctx: any = canvas.getContext('2d');
                const options = point.options;

                const myChart = new Chart(ctx, options);

                myChart.update({
                    duration: 0,
                    lazy: false,
                    easing: 'easeOutBounce'
                });

                myChart.render();

                myChart.stop();

                const ndviChart = this.getImageObject(myChart && myChart.toBase64Image() ? [myChart.toBase64Image()] : null, [500, 500], [10, 0], 'center');
                const geoserverImage = this.getImageObject(await this.getBaseImageUrl(point.url), [200, 200], [10, 70], 'center');

                const chartImage = {
                    geoserverImageNdvi: geoserverImage,
                    myChart: ndviChart
                };

                this.chartImages.push(chartImage);
                ++count;
            }
        }

        await this.getReportData();
    }

    async getContextDeflorestationAlerts(deflorestationAlerts) {
        const deflorestationAlertsContext = [];

        if (deflorestationAlerts && deflorestationAlerts.length > 0) {
            let images = [];
            let titleDate = [];
            let subTitleArea = [];
            let startingYear = new Date().getFullYear();

            for (let i = 0; i < deflorestationAlerts.length; ++i) {
                images.push(this.getImageObject(await this.getBaseImageUrl(deflorestationAlerts[i].urlGsImageBefore), [225, 225], [0, 0, 0, 0], 'left'));
                images.push(this.getImageObject(await this.getBaseImageUrl(deflorestationAlerts[i].urlGsImageCurrent), [225, 225], [13, 0, 0, 0], 'rigth'));

                startingYear = (deflorestationAlerts[i].year - 1) < startingYear ? (deflorestationAlerts[i].year - 1) : startingYear;

                titleDate.push({
                    text: `Alerta(${deflorestationAlerts[i].date}) - Imagem(${deflorestationAlerts[i].year - 1})`,
                    fontSize: 8,
                    style: 'body',
                    alignment: 'center'
                });

                titleDate.push({
                    text: `Alerta(${deflorestationAlerts[i].date}) - Imagem(${deflorestationAlerts[i].date})`,
                    fontSize: 8,
                    style: 'body',
                    alignment: 'center'
                });

                subTitleArea.push({
                    text: `${formatNumber(deflorestationAlerts[i].area, 'pt-BR', '1.0-4')} ha`,
                    fontSize: 8,
                    style: 'body',
                    alignment: 'center'
                });

                if (i === 0) {
                    deflorestationAlertsContext.push(
                        {
                            text: `Na  figura 3, a seguir, será  representado  o detalhamento  dos  alertas.`,
                            alignment: 'right',
                            margin: [30, 0, 30, 0],
                            style: 'body'
                        }
                    );
                } else {
                    deflorestationAlertsContext.push(
                        {
                            text: '',
                            pageBreak: 'after'
                        }
                    );
                }
                deflorestationAlertsContext.push(
                    {
                        columns: titleDate,
                        margin: [30, 0, 30, 0]
                    },
                    {
                        columns: images,
                        margin: [30, 0, 30, 0]
                    },
                    {
                        columns: [
                            this.getImageObject(await this.getBaseImageUrl(deflorestationAlerts[i].urlGsImagePlanetCurrentAndCar), [420, 420], [0, 0], 'center')
                        ],
                        margin: [30, 5, 30, 0]
                    },
                    {
                        columns: subTitleArea,
                        margin: [30, 5, 30, 5]
                    }
                );

                images = [];
                titleDate = [];
                subTitleArea = [];
            }

            deflorestationAlertsContext.push({
                text: [
                    {
                        text: 'Figura 3. ',
                        bold: true
                    },
                    {
                        text: ` Comparativo de imagens de satélite anterior à ${startingYear} e atual ${new Date().getFullYear()}.`,
                        bold: false
                    }
                ],
                margin: [30, 0, 30, 0],
                alignment: 'center',
                fontSize: 9
            });
        }
        return deflorestationAlertsContext;
    }

    async getContextDesflorestationHistory(deflorestationHistory, urlGsDeforestationHistory, urlGsDeforestationHistory1) {
        const deflorestationHistoryContext = [];

        if (deflorestationHistory && deflorestationHistory.length > 0) {
            let images = [];
            let titles = [];
            let subTitles = [];

            deflorestationHistoryContext.push({
                text: '',
                pageBreak: 'after'
            });
            deflorestationHistoryContext.push({
                columns: [{
                    text: `O histórico do  desmatamento nos  últimos 12  anos pode  se visto  na`,
                    alignment: 'justify',
                    margin: [157, 0, 30, 0],
                    style: 'body'
                }]
            });
            deflorestationHistoryContext.push({
                text: `figura 7.`,
                margin: [30, 0, 30, 5],
                style: 'body'
            });
            let count = 1;
            for (let i = 0; i < deflorestationHistory.length; ++i) {
                count += 1;
                const view = deflorestationHistory[i].date < 2013 ? 'LANDSAT_5_' :
                    deflorestationHistory[i].date < 2017 ? 'LANDSAT_8_' :
                        'SENTINEL_2_';

                let url = deflorestationHistory[i].date === 2012 ? urlGsDeforestationHistory1 : urlGsDeforestationHistory.replace(new RegExp('#{image}#', ''), `${view}${deflorestationHistory[i].date}`);
                url = url.replace(new RegExp('#{year}#', ''), deflorestationHistory[i].date);

                const alignment = count === 1 ? 'left' : count === 2 ? 'center' : 'rigth';

                images.push(this.getImageObject(await this.getBaseImageUrl(url), [117, 117], [5, 0], 'center'));
                titles.push({
                    text: `${deflorestationHistory[i].date}`,
                    style: 'body',
                    alignment: 'center'
                });
                subTitles.push({
                    text: `${deflorestationHistory[i].area} ha`,
                    style: 'body',
                    alignment: 'center'
                });

                if (((i + 1) % 3) === 0) {
                    deflorestationHistoryContext.push(
                        {
                            columns: titles,
                            margin: [30, 0, 30, 0]
                        },
                        {
                            columns: images,
                            margin: [30, 0, 30, 0]
                        },
                        {
                            columns: subTitles,
                            margin: [30, 0, 30, 10]
                        }
                    );

                    images = [];
                    titles = [];
                    subTitles = [];
                }
            }

            deflorestationHistoryContext.push(
                {
                    text: [
                        {
                            text: 'Figura 7. ',
                            bold: true
                        },
                        {
                            text: ` Histórico de desmatamento do PRODES nos últimos 12 anos.`,
                            bold: false
                        }
                    ],
                    margin: [30, 0, 30, 0],
                    alignment: 'center',
                    fontSize: 9
                });
        }

        return deflorestationHistoryContext;
    }

    async getReportData() {

        this.dateFilter = `${this.date[0]}/${this.date[1]}`;
        const startDate = new Date(this.date[0]).toLocaleDateString('pt-BR');
        const endDate = new Date(this.date[1]).toLocaleDateString('pt-BR');

        this.currentYear = new Date().getFullYear();

        const today = new Date();

        this.reportData = await this.finalReportService.getReportCarData(this.carRegister, this.date, this.filter, this.type).then((response: Response) => response.data);
        await this.formatValueLocate[this.type](this.reportData);
        this.reportData['type'] = this.type;
        this.reportData['date'] = this.date;
        this.reportData['carRegister'] = this.carRegister;
        this.reportData['formattedFilterDate'] = `${startDate} a ${endDate}`;
        this.reportData['currentYear'] = new Date().getFullYear();
        this.reportData['currentDate'] = `${this.setFormatDay(today.getDate())}/${this.setFormatMonth(today.getMonth())}/${today.getFullYear()}`;

        if (!this.reportData['images']) {
            this.reportData['images'] = {};
        }

        this.reportData.images['geoserverImage1'] = this.getImageObject(await this.getBaseImageUrl(this.reportData.urlGsImage), [200, 200], [0, 10], 'center');
        this.reportData.images['geoserverImage2'] = this.getImageObject(await this.getBaseImageUrl(this.reportData.urlGsImage1), [200, 200], [0, 10], 'center');

        this.reportData.images['geoserverImage4'] = this.getImageObject(await this.getBaseImageUrl(this.reportData.urlGsImage3), [200, 200], [0, 10], 'left');
        this.reportData.images['geoserverImage5'] = this.getImageObject(await this.getBaseImageUrl(this.reportData.urlGsImage4), [200, 200], [0, 10], 'right');
        this.reportData.images['geoserverImage6'] = this.getImageObject(await this.getBaseImageUrl(this.reportData.urlGsImage5), [200, 200], [0, 10], 'left');
        this.reportData.images['geoserverImage7'] = this.getImageObject(await this.getBaseImageUrl(this.reportData.urlGsImage6), [200, 200], [0, 10], 'right');

        if (this.reportData['type'] === 'prodes') {
            this.reportData.images['geoserverImage3'] = this.getImageObject(await this.getBaseImageUrl(this.reportData.urlGsImage2), [200, 200], [0, 10], 'center');
            this.reportData['desflorestationHistoryContext'] = await this.getContextDesflorestationHistory(this.reportData.property['deflorestationHistory'], this.reportData.urlGsDeforestationHistory, this.reportData.urlGsDeforestationHistory1);
            this.reportData.images['geoserverLegend'] = this.getImageObject(await this.getBaseImageUrl(this.reportData.urlGsLegend), [200, 200], [0, 10], 'center');
        }

        if (this.reportData['type'] === 'deter') {
            this.reportData['deflorestationAlertsContext'] = await this.getContextDeflorestationAlerts(this.reportData.property.deflorestationAlerts);
        }

        if (this.reportData['type'] === 'queimada') {
            const historyBurnlight = this.reportData['property']['historyBurnlight'];
            const labels = [];
            const dataFocus = [];
            const dataUnauthorizedFocus = [];
            historyBurnlight.forEach(element => {
                labels.push(element['month_year_occurrence']);
                dataFocus.push(element['total_focus']);
                dataUnauthorizedFocus.push(element['unauthorized_focus']);
            });
            const chartIndexes = ['FocusChartImage', 'unauthorizedChartImage'];
            historyBurnlight.forEach((element, index) => {
                const canvas: any = document.createElement('canvas');
                canvas.id = `burned${index}`;
                canvas.setAttribute('width', 600);
                canvas.setAttribute('height', 200);
                canvas.setAttribute('style', 'display: none');

                document.body.appendChild(canvas);

                const ctx: any = canvas.getContext('2d');
                const options = {
                    type: 'line',
                    data: {
                        labels,
                        lineColor: 'rgb(10,5,109)',
                        datasets: [{
                            label: 'Número de focos de calor',
                            data: chartIndexes[index] === 'FocusChartImage' ? dataFocus : dataUnauthorizedFocus,
                            backgroundColor: 'rgba(17,17,177,0)',
                            borderColor: 'rgba(5,177,0,1)',
                            showLine: true,
                            borderWidth: 2,
                            pointRadius: 0
                        }]
                    },
                    options: {
                        responsive: false,
                        legend: {
                            display: false
                        }
                    }
                };

                const burnedChart = new Chart(ctx, options);

                burnedChart.update({
                    duration: 0,
                    lazy: false,
                    easing: 'easeOutBounce'
                });

                burnedChart.render();

                burnedChart.stop();

                const focusChart = this.getImageObject(burnedChart && burnedChart.toBase64Image() ? [burnedChart.toBase64Image()] : null, [500, 500], [10, 0], 'center');

                // const focusChartImage = {
                //     myChart: focusChart
                // };
                this.reportData[chartIndexes[index]] = focusChart;
            });
        }

        this.reportData['chartImages'] = this.chartImages;
        this.reportData['type'] = this.reportData['type'];
        // const firingAuth = this.reportData['property']['firingAuth'];

        this.docDefinition = await this.reportService.createPdf(this.reportData).then(async (response: Response) => {

            response.data.docDefinitions.footer = (pagenumber, pageCount) => {
                return {
                    table: {
                        body: [
                            [
                                {
                                    text: 'Página ' + pagenumber + ' de ' + pageCount,
                                    fontSize: 8,
                                    margin: [483, 0, 30, 0]
                                }
                            ],
                        ]
                    },
                    layout: 'noBorders'
                };
            };

            response.data.docDefinitions.header = (currentPage, pageCount, pageSize) => {
                return {
                    columns: response.data.headerDocument
                };
            };

            this.getPdfBase64(response.data.docDefinitions);
        });
    }

    setFormatMonth(date) {
        return ('0' + (date + 1)).slice(-2);
    }

    setFormatDay(date) {
        return ('0' + (date)).slice(-2);
    }

    getPdfBase64(docDefinition) {
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);

        pdfDocGenerator.getBase64((data) => {
            this.docBase64 = data;
        });
    }

    async getBase64ImageFromUrl(imageUrl) {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result), false);
            reader.onerror = () => reject(this);
            reader.readAsDataURL(blob);
        });
    }

    async getBaseImageUrl(url: string) {
        return await this.getBase64ImageFromUrl(url).then(result => {
            const baseImageAux = [];
            baseImageAux.push(result);
            return baseImageAux;
        }).catch(err => console.error(err));
    }

    async generatePdf(action = 'open') {
        this.confirmationService.confirm({
            message: 'Deseja gerar o relatório em PDF?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                this.generatingReport = true;
                this.reportData.property['sat'] = this.inputSat;
                this.reportData.property['comments'] = this.textAreaComments;
                this.reportService.generatePdf(this.reportData).then((response: Response) => {
                    const reportResp = (response.status === 200) ? response.data : {};
                    if (response.status === 200) {
                        reportResp.document.docDefinitions.footer = (pagenumber, pageCount) => {
                            return {
                                table: {
                                    body: [
                                        [
                                            {
                                                text: 'Página ' + pagenumber + ' de ' + pageCount,
                                                fontSize: 8,
                                                margin: [483, 0, 30, 0]
                                            }
                                        ],
                                    ]
                                },
                                layout: 'noBorders'
                            };
                        };
                        reportResp.document.docDefinitions.header = (currentPage, pageCount, pageSize) => {
                            return {
                                columns: reportResp.document.headerDocument
                            };
                        };

                        pdfMake.createPdf(reportResp.document.docDefinitions).download(reportResp.name);
                        this.generatingReport = false;
                    } else {
                        this.generatingReport = false;
                        alert(`${response.status} - ${response.message}`);
                    }
                });
            },
            reject: () => {
                this.generatingReport = false;
            }
        });
    }

    onViewReportClicked(reportType) {
        const register = this.reportData.carRegister;
        if (reportType) {
            this.router.navigateByUrl(`/finalReport/${reportType}/${register}`);
            this.docBase64 = null;
            this.reportService.changeReportType.next();
        } else {
            this.router.navigateByUrl(`/report/${register}`);
        }
    }

    getImageObject(image, fit, margin, alignment) {
        if (image && image[0] && !image[0].includes('data:application/vnd.ogc.se_xml')) {
            return new Image(
                image,
                fit,
                margin,
                alignment
            );
        } else {
            return {
                text: 'Imagem não encontrada.',
                alignment: 'center',
                color: '#ff0000',
                fontSize: 9,
                italics: true,
                margin: [30, 60, 30, 60]
            };
        }
    }
}
