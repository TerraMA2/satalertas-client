import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { SidebarService } from 'src/app/services/sidebar.service';

import { ReportService } from '../../services/report.service';

import { SatVegService } from '../../services/sat-veg.service';

import { Response } from 'src/app/models/response.model';

import pdfMake from 'pdfmake/build/pdfmake';

import Chart from 'chart.js';

import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { FinalReportService } from '../../services/final-report.service';

import { AuthService } from 'src/app/services/auth.service';

import { ConfirmationService, MessageService } from 'primeng/api';

import { Image } from '../../models/image.model';

@Component({
  selector: 'app-final-report',
  templateUrl: './final-report.component.html',
  styleUrls: ['./final-report.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService]
})

export class FinalReportComponent implements OnInit, AfterViewInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private sidebarService: SidebarService,
    private reportService: ReportService,
    private finalReportService: FinalReportService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private satVegService: SatVegService,
    private confirmationService: ConfirmationService
  ) {  }

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
  async ngOnInit() {
    this.inputSat = '';
    this.textAreaComments = '';

    this.authService.user.subscribe(user => {
      if (!user) {
        this.router.navigateByUrl('/map');
        this.messageService.add({severity: 'error', summary: 'Atenção!', detail: 'Usuário não autenticado.'});
      }
    });
    this.activatedRoute.params.subscribe(params => {
      this.carRegister = params.carRegister;
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
        const options = await this.satVegService.get({
          long: point.long,
          lat: point.lat
        }, 'ndvi', 3, 'wav', '', 'aqua').then(async (resp: Response) => {
          return {
            type: 'line',
            data: {
              labels: resp.data['listaDatas'],
              lineColor: 'rgb(10,5,109)',
              datasets: [{
                label: '',
                data: resp.data['listaSerie'],
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
        });

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

  async getReportData() {

    this.dateFilter = `${this.date[0]}/${this.date[1]}`;
    const startDate = new Date(this.date[0]).toLocaleDateString('pt-BR');
    const endDate = new Date(this.date[1]).toLocaleDateString('pt-BR');

    this.currentYear = new Date().getFullYear();

    const today = new Date();

    this.reportData = await this.finalReportService.getReportCarData(this.carRegister, this.date, this.filter, this.type).then( (response: Response) => response.data );
    this.reportData['type'] = this.type;
    this.reportData['date'] = this.date;
    this.reportData['carRegister'] =  this.carRegister;
    this.reportData['formattedFilterDate'] = `${startDate} A ${endDate}`;
    this.reportData['currentYear'] = new Date().getFullYear();
    this.reportData['currentDate'] =  `${this.setFormatDay(today.getDate())}/${this.setFormatMonth(today.getMonth())}/${today.getFullYear()}`;

    if (!this.reportData['images']) { this.reportData['images'] = {}; }

    this.reportData.images['geoserverImage1'] = this.getImageObject(await this.getBaseImageUrl(this.reportData.urlGsImage), [200, 200], [0, 10], 'center');
    this.reportData.images['geoserverImage2'] = this.getImageObject(await this.getBaseImageUrl(this.reportData.urlGsImage1), [200, 200], [0, 10], 'center');

    if (this.reportData['type'] === 'prodes') {
      this.reportData.images['geoserverImage3'] = this.getImageObject(await this.getBaseImageUrl(this.reportData.urlGsImage2), [200, 200], [0, 10], 'center');
      this.reportData.images['geoserverImage4'] = this.getImageObject(await this.getBaseImageUrl(this.reportData.urlGsImage3), [150, 150], [0, 10], 'left');
      this.reportData.images['geoserverImage5'] = this.getImageObject(await this.getBaseImageUrl(this.reportData.urlGsImage4), [150, 150], [0, 10], 'center');
      this.reportData.images['geoserverImage6'] = this.getImageObject(await this.getBaseImageUrl(this.reportData.urlGsImage5), [150, 150], [0, 10], 'right');
      this.reportData.images['geoserverLegend'] = this.getImageObject(await this.getBaseImageUrl(this.reportData.urlGsLegend), [200, 200], [0, 10], 'center');
    }

    this.reportData['chartImages'] = this.chartImages;
    this.reportData['type'] = this.reportData['type'];

    this.docDefinition = await this.reportService.createPdf(this.reportData).then( async (response: Response) => {

      // tslint:disable-next-line:only-arrow-functions
      response.data.docDefinitions.footer = function(pagenumber, pageCount) {
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

      // tslint:disable-next-line:only-arrow-functions
      response.data.docDefinitions.header = function(currentPage, pageCount, pageSize) {
        return {
          columns: response.data.headerDocument
        };
      };

      this.getPdfBase64(response.data.docDefinitions);
    });
  }

  setFormatMonth(date){
    return ('0' + (date + 1)).slice(-2)
  }

  setFormatDay(date){
    return ('0' + (date)).slice(-2)
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
    const result = await new Promise((resolve, reject) => {
      const reader  = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.onerror = () => reject(this);
      reader.readAsDataURL(blob);
    });
    return result;
  }

  async getBaseImageUrl(url: string) {
    const baseImage = await this.getBase64ImageFromUrl(url).then(result => {
      const baseImageAux = [];
      baseImageAux.push(result);
      return baseImageAux;
    }).catch(err => console.error(err));
    return baseImage;
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
        this.reportService.generatePdf(this.reportData).then( (response: Response) => {
          const reportResp = (response.status === 200) ? response.data : {};
          if (response.status === 200) {
            // tslint:disable-next-line:only-arrow-functions
            reportResp.document.docDefinitions.footer = function(pagenumber, pageCount) {
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
            // tslint:disable-next-line:only-arrow-functions
            reportResp.document.docDefinitions.header = function(currentPage, pageCount, pageSize) {
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
