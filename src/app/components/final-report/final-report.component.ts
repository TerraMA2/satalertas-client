import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HTTPService } from 'src/app/services/http.service';

import { ConfigService } from 'src/app/services/config.service';

import { SidebarService } from 'src/app/services/sidebar.service';

import { Property } from 'src/app/models/property.model';

import {ReportService} from '../../services/report.service';

import { Response } from 'src/app/models/response.model';

import pdfMake from 'pdfmake/build/pdfmake';

import Chart from 'chart.js';

import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { FinalReportService } from '../../services/final-report.service';
import {Canvas} from 'leaflet';


@Component({
  selector: 'app-final-report',
  templateUrl: './final-report.component.html',
  styleUrls: ['./final-report.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class FinalReportComponent implements OnInit, AfterViewInit {

  @ViewChild('myChart', {static: false}) myChart: Chart;
  @ViewChild('imagem2', {static: false}) imagem2: Chart;
  @ViewChild('chartImg', {static: false}) chartImg: Chart;

  private reportConfig;


  private headerImage1 = [];
  private headerImage2 = [];

  private geoserverImage1;
  private geoserverImage2;
  private geoserverImage3;
  private geoserverImage4;
  private geoserverImage5;

  private geoserverLegend;

  private chartImage1;
  private chartImage2;
  private chartImage3;

  private partnerImage1 = [];
  private partnerImage2 = [];
  private partnerImage3 = [];
  private partnerImage4 = [];
  private partnerImage5 = [];
  private partnerImage6 = [];
  private partnerImage7 = [];
  private partnerImage8 = [];

  property;

  carRegister: string;

  dateFilter: string;

  formattedFilterDate: string;

  currentYear: number;
  currentDate: string;
  prodesStartYear: string;

  tableColumns;

  type: string;
  year: string;

  tableData;

  docDefinition: any;
  docBase64;
  generatingReport = false;

  bbox: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private hTTPService: HTTPService,
    private configService: ConfigService,
    private sidebarService: SidebarService,
    private reportService: ReportService,
    private finalReportService: FinalReportService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.carRegister = params.carRegister;
      this.type = params.type;
    });

    this.reportService.changeReportType.subscribe(() => {
      this.activatedRoute.params.subscribe(params => {
        this.carRegister = params.carRegister;
        this.type = params.type;
        this.getReportData();
      });
    });

    this.year = new Date().getFullYear().toString();
    this.reportConfig = this.configService.getReportConfig();

    this.sidebarService.sidebarLayerShowHide.next(false);

    this.tableColumns = [
      { field: 'affectedArea', header: 'Área atingida' },
      { field: 'recentDeforestation', header: 'Desmatamento recente (DETER – ha ano-1)' },
      { field: 'pastDeforestation', header: 'Desmatamento pretérito (PRODES – ha ano-1)' },
      { field: 'burnlights', header: 'Focos de Queimadas (Num. de focos)' },
      { field: 'burnAreas', header: 'Áreas Queimadas (ha ano-1)' }
    ];

    await this.getReportData();
  }

  ngAfterViewInit() {
    const canvas: any = document.getElementById('myChart');
    const ctx: any = canvas.getContext('2d');

    const options = {
      type: 'line',
      data: {
        labels: ['Novo', 'Dois', 'Tres'],
        datasets: [{
          label: '# of Votes',
          data: [1, 2, 3],
          backgroundColor: [
            'rgba(255,255,255, 0)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        display: true
      }
    };


    const newCanvas: any = document.getElementById('imagem2');
    const newCtx: any = newCanvas.getContext('2d');

    const newOptions = {
      type: 'line',
      data: {
        labels: ['2016', '2016', '2016', '2016', '2016', '2016', '2016', '2016', '2016', '2016', '2016'],
        datasets: [{
          label: 'NDVI',
          data: [100, 212, 333, 125, 20, 400, 212, 333, 125, 20, 400],
          backgroundColor: [
            'rgba(255,255,255, 0)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        display: true
      }
    };

    const chartImgCanvas: any = document.getElementById('chartImg');
    const ctxChartImg: any = chartImgCanvas.getContext('2d');

    const optionsChartImg = {
      type: 'line',
      data: {
        labels: ['New', 'In Progress', 'On Hold', 'On Hold', 'On Hold', 'dddd'],
        datasets: [{
          label: '# of Votes',
          data: [100, 212, 333, 125, 20, 400],
          backgroundColor: [
            'rgba(255, 255, 255, 0)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        display: true
      }
    };


    this.imagem2 = new Chart(newCtx, newOptions);
    this.myChart = new Chart(ctx, options);
    this.chartImg = new Chart(ctxChartImg, optionsChartImg);
  }

  setImageToBase64() {
    return {image1: this.myChart.toBase64Image(), image2: this.imagem2.toBase64Image(), image3: this.chartImg.toBase64Image()};
  }

  async getReportData() {

    const date = JSON.parse(localStorage.getItem('dateFilter'));
    this.dateFilter = `${date[0]}/${date[1]}`;
    const startDate = new Date(date[0]).toLocaleDateString('pt-BR');
    const endDate = new Date(date[1]).toLocaleDateString('pt-BR');

    this.formattedFilterDate = `${startDate} - ${endDate}`;

    this.currentYear = new Date().getFullYear();

    const today = new Date();

    this.currentDate = today.getDate() + '/' + today.getMonth() + 1 + '/' + today.getFullYear();

    const filter = localStorage.getItem('filterList');

    const propertyConfig = this.reportConfig.propertyData;

    const viewId = propertyConfig.viewId;
    this.carRegister = this.carRegister.replace('\\', '/');
    const carRegister = this.carRegister;

    await this.finalReportService.getCarData(viewId, carRegister, date, filter).then((reportData: Property) => {

      this.prodesStartYear = reportData.prodesYear && reportData.prodesYear.length > 0 ? reportData.prodesYear[0]['date'] : '2007';

      const bboxArray = reportData.bbox.split(',');
      this.bbox = bboxArray[0].split(' ').join(',') + ',' + bboxArray[1].split(' ').join(',');

      reportData.bbox = this.bbox;

      this.property = reportData;

      const app = reportData.app;
      const legalReserve = reportData.legalReserve;
      const conservationUnit = reportData.conservationUnit;
      const indigenousLand = reportData.indigenousLand;
      const consolidatedUse = reportData['consolidatedUse'];
      // const exploration = reportData['exploration'];
      const deforestation = reportData['deforestation'];
      const embargoedArea = reportData['embargoedArea'];
      const landArea = reportData['landArea'];

      const propertyDeforestation = [
        app,
        legalReserve,
        conservationUnit,
        indigenousLand,
        consolidatedUse,
        // exploration,
        deforestation,
        embargoedArea,
        landArea
      ];

      this.tableData = propertyDeforestation;
    });

    const gsImage = `http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_5:view5,terrama2_5:view5,terrama2_6:view6&styles=&bbox=-61.6904258728027,-18.0950622558594,-50.1677627563477,-7.29556512832642&width=250&height=250&cql_filter=id_munic>0;municipio='${this.property.city}';numero_do1='${this.property.register}'&srs=EPSG:4326&format=image/png`;
    const gsImage1 = `http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_6:view6&styles=&bbox=${this.property.bbox}&width=400&height=400&time=${this.prodesStartYear}/P1Y&cql_filter=numero_do1='${this.property.register}'&srs=EPSG:4326&format=image/png`;
    const gsImage2 = `http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_6:view6,terrama2_86:view86&styles=terrama2_6:view6_style,terrama2_8:view8_style&bbox=${this.property.bbox}&width=404&height=431&time=${this.prodesStartYear}/${this.currentYear}&cql_filter=numero_do1='${this.property.register}';de_car_validado_sema_numero_do1='${this.property.register}'&srs=EPSG:4674&format=image/png`;
    const gsImage3 = `http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_6:MosaicSpot2008_car_validado&styles=&bbox=${this.property.bbox}&width=400&height=400&time=${this.prodesStartYear}/P1Y&cql_filter=numero_do1='${this.property.register}'&srs=EPSG:4326&format=image/png`;
    const gsImage4 = `http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_6:view6,terrama2_86:view86&styles=&bbox=${this.property.bbox}&width=400&height=400&time=${this.currentYear}/P1Y&cql_filter=numero_do1='${this.property.register}';de_car_validado_sema_numero_do1='${this.property.register}'&srs=EPSG:4674&format=image/png`;

    const gsLegend = `http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&legend_options=forceLabels:on;layout:vertical&LAYER=terrama2_8:view8`;

    this.geoserverImage1 = await this.getBaseImageUrl(gsImage);
    this.geoserverImage2 = await this.getBaseImageUrl(gsImage1);
    this.geoserverImage3 = await this.getBaseImageUrl(gsImage2);
    this.geoserverImage4 = await this.getBaseImageUrl(gsImage3);
    this.geoserverImage5 = await this.getBaseImageUrl(gsImage4);

    this.geoserverLegend = await this.getBaseImageUrl(gsLegend);

    this.toDataUrl('assets/img/logos/mpmt-small.png', headerImage1 => {
      this.headerImage1.push(headerImage1);
      this.toDataUrl('assets/img/logos/inpe.png', headerImage2 => {
        this.headerImage2.push(headerImage2);
        this.toDataUrl('assets/img/logos/mpmt-small.png', partnerImage1 => {
          this.partnerImage1.push(partnerImage1);
          this.toDataUrl('assets/img/logos/pjedaou-large.png', partnerImage2 => {
            this.partnerImage2.push(partnerImage2);
            this.toDataUrl('assets/img/logos/caex.png', partnerImage3 => {
              this.partnerImage3.push(partnerImage3);
              this.toDataUrl('assets/img/logos/inpe.png', partnerImage4 => {
                this.partnerImage4.push(partnerImage4);
                this.toDataUrl('assets/img/logos/dpi.png', partnerImage5 => {
                  this.partnerImage5.push(partnerImage5);
                  this.toDataUrl('assets/img/logos/terrama2-large.png', partnerImage6 => {
                    this.partnerImage6.push(partnerImage6);
                    this.toDataUrl('assets/img/logos/mt.png', partnerImage7 => {
                      this.partnerImage7.push(partnerImage7);
                      this.toDataUrl('assets/img/logos/sema.png', partnerImage8 => {
                        this.partnerImage8.push(partnerImage8);

                        const images = this.setImageToBase64();

                        this.chartImage1 = images.image1;
                        this.chartImage2 = images.image2;
                        this.chartImage3 = images.image3;

                        this.getDocumentDefinition();
                        this.getPdfBase64(this.docDefinition);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
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

  toDataUrl(file, callback) {
    const xMLHttpRequest = new XMLHttpRequest();

    xMLHttpRequest.responseType = 'blob';

    xMLHttpRequest.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result);
      reader.readAsDataURL(xMLHttpRequest.response);
    };

    xMLHttpRequest.open('GET', file, true);
    xMLHttpRequest.send();
  }

  getHeaderDocument() {
    return [
      {
        image: this.headerImage1,
        width: 180,
        height: 50,
        alignment: 'left',
        margin: [30, 25, 0, 30]
      },
      {
        text: [
          {
            text: 'Procuradoria Geral de Justiça\n',
            bold: true
          },
          {
            text: 'Centros de Apoio Operacional',
            bold: false
          }
        ],
        fontSize: 8,
        alignment: 'left',
        margin: [30, 30, 0, 5]
      },
      {
        image: this.headerImage2,
        width: 60,
        height: 50,
        alignment: 'right',
        margin: [0, 15, 10, 20]
      }
    ];
  }

  generatePdf(action = 'open') {
    this.generatingReport = true;

    this.reportService.generatePdf(this.docDefinition, this.type, this.carRegister).then( (response: Response) => {
      const reportResp = (response.status === 200) ? response.data : {};
      if (response.status === 200) {
        setTimeout( () => {
          this.reportService.getReportById(reportResp.id).then( (resp: Response) => {
            const res = (resp.status === 200) ? resp.data : {};
            this.generatingReport = false;
            window.open(window.URL.createObjectURL(this.base64toBlob(res.base64, 'application/pdf')));
          });
        }, 2000);
      } else {
        this.generatingReport = false;
        alert(`${response.status} - ${response.message}`);
      }
    });
  }

  base64toBlob(content, contentType) {
    contentType = contentType || '';

    const sliceSize = 512;

    const byteCharacters = window.atob(content);

    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {
      type: contentType
    });

    return blob;
  }

  onViewReportClicked(reportType) {
    this.router.navigateByUrl(`/finalReport/${reportType}/${this.carRegister.replace('/', '\\')}`);
    this.docBase64 = null;
    this.reportService.changeReportType.next();
  }

  async getDocumentDefinition() {
    if (this.type === 'prodes') {
      await this.getPRODESDocumentDefinition();
    } else if (this.type === 'deter') {
      await this.getDETERDocumentDefinition();
    } else if (this.type === 'queimada') {
      await this.getQUEIMADAocumentDefinition();
    }
  }

  getPRODESDocumentDefinition() {
    const headerDocument = this.getHeaderDocument();

    const docDefinition = {
      info: {
        title: 'Relatório PRODES'
      },
      pageMargins: [ 30, 30, 30, 30 ],
      footer(currentPage, pageCount) {
        return {
          table: {
            body: [
              [
                {
                  text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                  fontSize: 8,
                  margin: [500, 0, 30, 0]
                }
              ],
            ]
          },
          layout: 'noBorders'
        };
      },
      content: [
        {
          columns: headerDocument
        },
        {
          text: [
            {
              text: 'MUNICÍPIO:',
              bold: true
            },
            {
              text: ` ${this.property.city}-MT`,
              bold: false
            }
          ],
          style: 'headerBody'
        },
        {
          text: [
            {
              text: 'COMARCA:',
              bold: true
            },
            {
              text: ` ${this.property.county}`,
              bold: false
            }
          ],
          style: 'headerBody',
          margin: [30, 0, 30, 20]
        },
        {
          text: 'SATÉLITES ALERTAS – TCT 30/2018 MPMT/INPE',
          color: 'green',
          style: 'title'
        },
        {
          text: `RELATÓRIO TÉCNICO DE DESMATAMENTO Nº XXXXX/${this.year}`,
          style: 'title',
          margin: [30, 0, 30, 20]
        },
        {
          text: '1 OBJETIVO',
          style: 'listItem'
        },
        {
          text: [
            {
              text: 'Trata-se de relatório técnico sobre desmatamentos ilegais identificados ',
              alignment: 'right',
            },
            {
              text: (
                ' com o uso de Sistema de Informações Geográficas no imóvel rural ' + this.property.name +
                ' (Figura 1), localizado no município de ' + this.property.city +
                '-MT, pertencente a ' + this.property.owner + ', conforme informações declaradas no ' +
                ' Sistema Mato-grossense de Cadastro Ambiental Rural (SIMCAR), protocolo CAR-MT ' + this.property.register
              ),
            },
            {
              text: ' (Anexo 1) ',
              bold: true
            },
            {
              text: (
                '/ acervo fundiário do Instituto Nacional de Colonização e Reforma Agrária (SIGEF/INCRA).'
              )
            }
          ],
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          columns: [
            {
              image: this.geoserverImage1,
              fit: [200, 200],
              margin: [0, 10],
              alignment: 'center'
            },
            {
              image: this.geoserverImage2,
              fit: [200, 200],
              margin: [0, 10],
              alignment: 'center'
            }
          ]
        },
        {
          text: [
            {
              text: 'Figura 1. ',
              bold: true
            },
            {
              text: 'Mapa de Localização e do Perímetro do Imóvel',
              bold: false
            }
          ],
          alignment: 'center',
          fontSize: 10
        },
        {
          text: '2 HISTÓRICO',
          style: 'listItem'
        },
        {
          text: 'As informações sobre os desmatamentos foram integradas no âmbito ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'do Termo de Cooperação Técnica n. 30/2018 firmado entre Ministério Público do Estado de Mato Grosso ' +
            'e Instituto Nacional de Pesquisas Espaciais (INPE), cujo objeto consiste na coleta automática, armazenamento ' +
            'e tratamento de dados geoespaciais para interseções entre produtos do PRODES, DETER e Programa Queimadas do ' +
            'INPE, com os dados de fontes estatais oficiais para quantificação e descrição das áreas afetadas por desmatamento ou queimada.'
          ),
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          columns: headerDocument
        },
        {
          text: '2.1 Dados utilizados',
          style: 'listItem'
        },
        {
          columns: [
            {
              text: 'a) ',
              margin: [50, 0, 0, 15],
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Dados das áreas desmatadas no Estado de Mato Grosso mapeadas pelo Programa de Monitoramento da Floresta ' +
                'Amazônica Brasileira por Satélite (PRODES) (desmatamento anual) desenvolvido pelo INPE;'
              ),
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'b) ',
              margin: [50, 0, 0, 15],
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Informações e dados geográficos do SIMCAR Parceiros e Público, da Secretaria de Meio Ambiente do Estado de Mato Grosso (SEMA), como: ' +
                'i. Proprietário(s)/posseiro(s); ' +
                'ii. Base de referência do CAR validado; ' +
                'iii. Base de referência do CAR em análise; ' +
                'iv. Base de referência do CAR aguardando complementação; '  +
                'v. Base de referência do CAR cancelado e indeferido; e ' +
                'vi. Base de referência do Programa de Regularização Ambiental (PRA);'
              ),
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'c) ',
              margin: [50, 0, 0, 15],
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Dados do Navegador Geográfico da SEMA (SIMGEO): ' +
                'i. Base de referência das áreas embargadas pela SEMA. ' +
                'ii. Base de referência das áreas desembargadas pela SEMA; ' +
                'iii. Base de referência das Autorizações de Exploração (AUTEX); ' +
                'iv. Base de referência das Autorizações de Desmatamento (AD); ' +
                'v. Base de referência das Áreas de Preservação Permanente (APP), Reserva Legal (ARL), Uso Restrito (AUS) e de Uso Consolidado (AUC);'
              ),
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'd) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: 'Dados do acervo fundiário do Instituto Nacional de Colonização e Reforma Agrária (SIGEF/INCRA);',
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'e) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Dados geográficos das Unidades de Conservação (UC) no Estado de Mato Grosso, disponíveis no Cadastro Nacional de Unidades ' +
                'de Conservação do Ministério de Meio Ambiente (MMA);'
              ),
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'f) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Dados geográficos das Terras Indígenas no Estado de Mato Grosso, disponíveis no sítio eletrônico da Fundação Nacional do Índio (FUNAI);'
              ),
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'g) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Mapa de vegetação do Projeto RadamBrasil;'
              ),
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'h) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: 'Perfil histórico dos índices de vegetação NDFI e EVI obtidos Land Processes Distributed Active Center (LP-DAAC);',
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'i) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: 'Imagens dos Satélites Landsat, SPOT, Planet, Sentinel-2, CBERS-4 e de outras fontes que estiverem disponíveis;',
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          columns: headerDocument
        },
        {
          columns: [
            {
              text: 'j) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: 'Dados pessoais dos responsáveis pelo imóvel rural obtidos no Sistema Nacional de Informações de Segurança Pública (SINESP-INFOSEG).',
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          text: '2.2 Método utilizado',
          style: 'listItem'
        },
        {
          text: 'Todas as informações acima descritas foram integradas utilizando a ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'plataforma computacional TerraMA2. Essa plataforma foi desenvolvida pelo INPE para o monitoramento, ' +
            'análise e emissão de alertas sobre extremos ambientais1. Assim, utilizando esta base tecnológica inovadora, ' +
            'no domínio de softwares abertos, as tarefas executadas pela plataforma foram definidas para coletar, ' +
            'analisar (intersecção de geometrias dos mapas), visualizar e consultar dados sobre danos ambientais causados ' +
            'por desmatamentos e queimadas. Para isso, dados dinâmicos e estáticos foram processados para produzirem as informações ' +
            'que foram sistematizadas neste relatório.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Os dados de desmatamentos (polígonos) do PRODES foram cruzados ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'com informações geoespaciais de fontes oficiais para identificação e quantificação ' +
            'dos danos ambientais causados por desmatamentos supostamente ilegais, bem como para ' +
            'identificação dos responsáveis pelo imóvel rural atingido, para fins de responsabilização civil, administrativa ' +
            'e, eventualmente, criminal pelos danos causados.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'As informações sobre o imóvel rural onde incidiu o desmatamento e',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: ' sua titularidade foram coletadas na base de dados do SIMCAR e/ou INCRA.',
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Para qualificação da área desmatada, o tipo de vegetação foi ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'identificado utilizando o mapa de vegetação do Projeto RadamBrasil.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Os dados geoespaciais do SIMGEO, MMA e FUNAI foram cruzados ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'com os dados do INPE para identificação e quantificação dos desmatamentos ao longo dos anos ' +
            'em áreas protegidas (APP, ARL, AUR, UC e TI), bem como para identificar ilícitos ambientais, mediante ' +
            'o cruzamento com dados das Autorizações de Exploração (AUTEX) e de Desmatamento (AD) emitidas pela SEMA. ' +
            'Ainda, verificou-se se as áreas desmatadas já haviam sido autuadas ou embargadas pela SEMA.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          columns: headerDocument
        },
        {
          text: 'Por fim, foi gerado um relatório com o histórico de imagens de ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'satélites e dos desmatamentos e queimadas ocorridos no imóvel rural, contendo ainda, o perfil ' +
            'histórico de NDVI e EVI das áreas desmatadas, a fim de melhorar a interpretação das intervenções ' +
            'antrópicas ocorridas. As séries temporais de índices vegetativos representam as variações de biomassa, sendo ' +
            'que o perfil ao longo de um ciclo hidrológico varia dependendo do tipo de vegetação, impactos ou uso alternativo da área.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'De acordo com o Sistema de Análise Temporal da Vegetação ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            '(SATVeg) da Empresa Brasileira de Pesquisa Agropecuária (EMBRAPA), os índices vegetativos ' +
            'NDVI e EVI são derivados das imagens do sensor MODIS, a bordo dos satélites Terra e Aqua. ' +
            'As imagens são adquiridas do Land Processes Distributed Active Center (LP-DAAC), que está ' +
            'vinculada a NASA\'s Earth Observing System (NASA EOS). As séries temporais dos índices vegetativos ' +
            'fazem parte da coleção 6 dos produtos MOD13Q1 (satélite Terra, com início em 18/02/2000) ' +
            'e MYD13Q1 (satélite Aqua, com início em 04/07/2002). Nestes produtos, o NDVI e o EVI são disponibilizados ' +
            'em composições máximas de 16 dias, com resolução espacial de aproximadamente 250m. Como exemplo, nas figuras ' +
            'abaixo podem ser observados os padrões gráficos do NDVI para floresta ombrófila densa, cerrado e quando da ' +
            'ocorrência de desmatamento. Mais informações sobre os padrões de perfis gráficos dos índices de vegetação, incluindo ' +
            'os padrões de culturas agrícolas, podem ser consultadas no sítio eletrônico do SATVeg¹.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          image: this.chartImage1,
          fit: [200, 200],
          alignment: 'center'
        },
        {
          text: [
            {
              text: 'Figura 2. ',
              bold: true
            },
            {
              text: (
                'Floresta Ombrófila Densa - Em função do clima predominantemente úmido, essa cobertura vegetal apresenta pouca variação ' +
                'nos valores dos índices de vegetação ao longo do ano. Além disso, esta cobertura apresenta valores elevados dos índices ' +
                'de vegetação durante o ano, em função da grande biomassa vegetal presente.'
              ),
              bold: false
            }
          ],
          margin: [30, 0, 30, 0],
          fontSize: 10,
          style: 'body'
        },
        {
          image: this.chartImage2,
          fit: [200, 200],
          alignment: 'center'
        },
        {
          text: [
            {
              text: 'Figura 3. ',
              bold: true
            },
            {
              text: (
                'Cerrado - Em função do clima sazonal, com verões chuvosos e invernos mais secos, essa cobertura vegetal apresenta '  +
                'oscilações significativas nos valores dos índices de vegetação ao longo do ano e, geralmente, apresenta valores intermediários ' +
                'no período chuvoso. Durante o inverno, com a queda das precipitações e a redução da biomassa vegetal ativa, os índices de vegetação ' +
                'declinam significativamente, retomando seu vigor apenas com a volta do período de chuvas.'
              ),
              bold: false
            }
          ],
          margin: [30, 0, 30, 0],
          fontSize: 10,
          style: 'body'
        },
        {
          image: this.chartImage3,
          fit: [200, 200],
          alignment: 'center'
        },
        {
          text: [
            {
              text: 'Figura 4. ',
              bold: true
            },
            {
              text: (
                'Desmatamento - Como as florestas apresentam valores de índice de vegetação mais elevados, com ' +
                'ou sem a presença de alguma variação pela sazonalidade, a depender do clima ao qual estão sujeitas, o ' +
                'fenômeno do desflorestamento é bastante evidente, pois define uma quebra brusca do padrão dessa variação ao longo do tempo.'
              ),
              bold: false
            }
          ],
          margin: [30, 0, 30, 0],
          fontSize: 10,
          style: 'body'
        },
        {
          text: '2.2.1 PRODES',
          style: 'listItem'
        },
        {
          text: 'Os projetos PRODES e DETER, utilizados para identificação e ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'quantificação dos desmatamentos, fazem parte do Programa de Monitoramento da Amazônia e '
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          columns: headerDocument
        },
        {
          text: (
            'Demais Biomas (PAMZ+)' +
            'desenvolvido pela Coordenação-geral de Observação da Terra (CGOBT) e Centro Regional da Amazônia (CRA) do INPE. ' +
            'Além do PRODES e DETER, o PAMZ+ conta também com o Sistema de Mapeamento do Uso e Ocupação da Terra (TerraClass). ' +
            'Estes três projetos são complementares e concebidos para atender diferentes objetivos.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'O objetivo do PRODES é estimar a taxa anual de desmatamento por ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'corte raso da floresta primária, excluídas as áreas de “não florestas”. Importante ressaltar que ' +
            'o termo “desmatamento” é definido como “a supressão de áreas de fisionomia florestal primária por ações ' +
            'antropogênicas” (SOUZA et al., 2019)1, ou seja, tratam-se de áreas sem histórico de intervenções pelo Homem ' +
            'que foram suprimidas a partir de 1988 por ação antrópica.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'O PRODES utiliza imagens de satélite geradas pela série Landsat da ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'NASA/USGS (EUA), caracterizadas por apresentarem resolução espacial de cerca de 30m e pelo ' +
            'menos três bandas espectrais. Atualmente, também são utilizadas imagens dos satélites Sentinel-2 ' +
            '(União Europeia) ou CBERS-4 (Brasil/China). As imagens desses satélites são disponibilizadas pelos ' +
            'seus provedores já ortorretificadas, com correção geométrica de sistema refinada pelo uso de pontos de ' +
            'controle e de modelos digitais de elevação do terreno, o que confere um nível mais alto de qualidade das ' +
            'informações, em concordância com as normas cartográficas vigentes. A avaliação da acurácia da metodologia do ' +
            'PRODES foi feita por Adami et al. (2017)1 para o Estado de Mato Grosso e por Maurano et al. (2019)2 para a Amazônia ' +
            'Legal, ambas para o ano 2014, resultando em uma precisão global de 94,5%±2,05 e exatidão global de 93%, respectivamente.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'O detalhamento da metodologia PRODES pode ser consultado em ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'Souza et al. (2019)1. Em suma, a metodologia do PRODES parte dos seguintes pressupostos: '
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          columns: [
            {
              text: '1) ',
              margin: [50, 0, 0, 5],
              italics: true,
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                '“O PRODES só identifica polígonos de desmatamento por corte raso (remoção completa da cobertura florestal primária) ' +
                'cuja área for superior a 6,25 haO PRODES só identifica polígonos de desmatamento por corte raso (remoção completa da ' +
                'cobertura florestal primária) cuja área for superior a 6,25 ha.'
              ),
              margin: [20, 0, 30, 5],
              italics: true,
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: '2) ',
              margin: [50, 0, 0, 5],
              italics: true,
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'As imagens utilizadas são da classe Landsat, ou seja, apresentam resolução espacial da ordem de 30 metros, ' +
                'taxa de revisita da ordem de 10 – 26 dias, 3 ou mais bandas espectrais, como por exemplo imagens do ' +
                'satélite Landsat-8, CBERS-4 ou similares.'
              ),
              margin: [20, 0, 30, 5],
              italics: true,
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: '3) ',
              margin: [50, 0, 0, 5],
              italics: true,
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Numa imagem a ser analisada pode haver áreas não-observadas devido a cobertura de nuvens. ' +
                'Em casos de alta cobertura de nuvem, imagens de múltiplos satélites (ou datas) podem ser usadas para compor uma localização.'
              ),
              margin: [20, 0, 30, 5],
              italics: true,
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          columns: headerDocument
        },
        {
          columns: [
            {
              text: '4) ',
              margin: [50, 0, 0, 5],
              italics: true,
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'O PRODES realiza o mapeamento dos incrementos de desmatamento através de fotointerpretação ' +
                'por especialistas. O PRODES adota uma metodologia de mapeamento incremental.'
              ),
              margin: [20, 0, 30, 5],
              italics: true,
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: '5) ',
              margin: [50, 0, 0, 5],
              italics: true,
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Na produção do mapeamento incremental, o PRODES usa uma máscara de exclusão, que encobre as áreas desmatadas nos ' +
                'anos anteriores. O trabalho de interpretação é feito apenas no pedaço da imagem do ano de referência que ainda ' +
                'contém floresta primária. Esta máscara é usada para eliminar a possibilidade de que desmatamentos antigos sejam ' +
                'mapeados novamente. A máscara de exclusão também inclui as áreas onde não há ocorrência natural de florestas, ' +
                'chamadas no PRODES de ‘não floresta’, além de áreas de hidrografia, sejam mapeadas como desmatamento”'
              ),
              margin: [20, 0, 30, 5],
              italics: true,
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          text: 'Os dados do INPE constituem fonte de acentuada importância para a ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'gestão ambiental, e já embasaram importantes acordos com setores ligados ao agronegócio, como o ' +
            'Termo de Ajustamento de Conduta (TAC) da carne, Moratória da Soja e outros acordos intergovernamentais, como ' +
            'o feito na Conferência das Nações Unidas Sobre Mudanças Climáticas (COP21) para a redução das emissões de gases ' +
            'de efeito estufa por desflorestamento e degradação florestal1. Ainda, a importância e credibilidade dos dados gerados ' +
            'pelo INPE é refletida pelas milhares de publicações científicas que utilizaram essas informações para realização de ' +
            'pesquisas, que podem ser encontrada no Google Scholar².'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: '3 ANÁLISE TÉCNICA',
          style: 'listItem'
        },
        {
          text: 'O INPE, a partir dos dados do PRODES, identificou desmatamento de ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            this.property.prodesArea + ' hectares no imóvel rural denominado ' + this.property.name +
            ' (período de 1988 a ' + this.currentYear + '), conforme dinâmica de desmatamento explicitada ' +
            'na Figura 2 e no Anexo 2 (relatório do histórico de imagens de satélite e desmatamentos e queimadas ' +
            'no imóvel rural). O proprietário/posseiro do imóvel rural foi identificado com base nos dados do SIMCAR / INCRA.'
          ),
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          columns: headerDocument
        },
        {
          columns: [
            {
              image: this.geoserverLegend,
              fit: [200, 200],
              margin: [0, 10],
              alignment: 'center'
            },
            {
              image: this.geoserverImage3,
              fit: [200, 200],
              margin: [0, 10],
              alignment: 'center'
            }
          ]
        },
        {
          text: [
            {
              text: 'Figura 2. ',
              bold: true
            },
            {
              text: 'Dinâmica de desmatamento - ' + this.prodesStartYear + '/' + this.currentYear,
              bold: false
            }
          ],
          margin: [30, 0, 30, 0],
          alignment: 'center',
          fontSize: 10,
          style: 'body'
        },
        {
          text: 'No Quadro 1 abaixo, consta a quantificação e descrição das áreas ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            ' desmatadas e queimadas que foram identificadas com o cruzamento dos dados descritos no histórico desse relatório.'
          ),
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          text: [
            {
              text: 'Quadro 1 ',
              alignment: 'right',
              margin: [30, 0, 30, 0],
              bold: true
            },
            {
              text: `- Classes e quantitativos de áreas desmatadas e queimadas no imóvel rural`,
              alignment: 'right',
              margin: [30, 0, 30, 0],
              bold: false
            }
          ],
          fontSize: 10
        },
        {
          text: ' denominado ' + this.property.name + '.',
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          style: 'tableStyle',
          table: {
            widths: [ '*', '*' ],
            headerRows: 1,
            body: [
              [
                {
                  text: 'Área atingida',
                  style: 'tableHeader'
                },
                {
                  text: 'Desmatamento pretérito\n(PRODES - ha ano-1)',
                  style: 'tableHeader'
                }
              ],
              ...this.tableData.map(rel => {
                return [
                        rel.affectedArea,
                        rel.pastDeforestation
                ];
              })
            ]
          },
          fontSize: 12
        },
        {
          text: 'Anota-se que os dados acima indicados indicam extreme de dúvidas, com grau ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'de acurácia com mais de 90% de acerto, no entanto, alterações nos valores poderão ocorrer ' +
            'em decorrência de trabalhos de campo, pelo uso de outras imagens de satélite com diferentes ' +
            'resoluções espaciais, radiométricas e temporais, bem como pela fotointerpretação do analista durante a vetorização das áreas.'
          ),
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          columns: headerDocument
        },
        {
          text: [
            {
              text: 'Na representação cartográfica abaixo ',
              alignment: 'right',
              style: 'body'
            },
            {
              text: '(Figura 6)',
              bold: true,
              style: 'body'
            },
            {
              text: (
                ' é possível visualizar, com imagens de alta resolução (Spot-2,5m e Planet-3m) como estava a cobertura ' +
                'do imóvel em ' + this.prodesStartYear + ' e como se encontra atualmente (' + this.currentYear + '), indicando ' +
                'a ocorrência de desmatamento ilegal no imóvel rural.'
              ),
              margin: [30, 0, 30, 15],
              style: 'body'
            },
          ],
          margin: [30, 0, 30, 0]
        },
        {
          columns: [
            {
              image: this.geoserverImage4,
              fit: [200, 200],
              alignment: 'center'
            },
            {
              image: this.geoserverImage5,
              fit: [200, 200],
              alignment: 'center'
            }
          ]
        },
        {
          text: [
            {
              text: 'Figura 6. ',
              bold: true
            },
            {
              text: 'Comparativo de imagens de satélite do ano ' + this.prodesStartYear + ' e ' + this.currentYear,
              bold: false
            }
          ],
          alignment: 'center',
          fontSize: 10
        },
        {
          text: '4 CONCLUSÃO',
          margin: [30, 20, 30, 0],
          style: 'listItem'
        },
        {
          text: `${this.property.foundProdes ? 'Houve' : 'Não houve'} desmatamento ilegal no imóvel rural objeto deste Relatório `,
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: 'Técnico, conforme descrito no Quadro 01 (vide item 3. Análise Técnica).',
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          text: '5 ANEXOS',
          style: 'listItem'
        },
        {
          text: [
            {
              text: 'Anexo 1.',
              style: 'body',
              bold: true
            },
            {
              text: ' – Informações sobre o CAR-MT ' + this.property.register + ';',
              style: 'body'
            }
          ],
          margin: [30, 0, 30, 0]
        },
        {
          text: [
            {
              text: 'Anexo 2.',
              style: 'body',
              bold: true
            },
            {
              text: ' – Relatório sobre o histórico de desmatamento no imóvel ',
              style: 'body'
            },
            {
              text: 'rural CAR-MT ' + this.property.register + ';',
              style: 'body'
            }
          ],
          margin: [30, 0, 30, 0],
        },
        {
          text: [
            {
              text: 'Anexo 3.',
              style: 'body',
              bold: true
            },
            {
              text: ' – Relatório do SINESP-IFOSEG referente aos ',
              alignment: 'right',
              style: 'body'
            },
            {
              text: 'proprietários/posseiros do imóvel rural.',
              style: 'body'
            }
          ],
          margin: [30, 0, 30, 0],
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          columns: headerDocument
        },
        {
          text: '6 VALIDAÇÃO',
          margin: [30, 20, 30, 0],
          style: 'listItem'
        },
        {
          text: `Este relatório técnico foi validado em ${this.currentDate} por: `,
          margin: [30, 0, 30, 100],
          alignment: 'center',
          style: 'body'
        },
        {
          text: 'Relatório técnico produzido em parceria com: ',
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          columns: [
            {
              image: this.partnerImage1,
              fit: [180, 50],
              alignment: 'left',
              margin: [30, 0, 0, 0]
            },
            {
              image: this.partnerImage2,
              fit: [100, 50],
              alignment: 'center',
              margin: [0, 0, 0, 0]
            },
            {
              image: this.partnerImage3,
              fit: [80, 50],
              alignment: 'right',
              margin: [0, 0, 40, 0]
            }
          ]
        },
        {
          columns: [
            {
              image: this.partnerImage4,
              fit: [130, 60],
              alignment: 'left',
              margin: [80, 30, 0, 0]
            },
            {
              image: this.partnerImage5,
              fit: [100, 60],
              alignment: 'center',
              margin: [95, 30, 0, 0]
            },
            {
              image: this.partnerImage6,
              fit: [100, 60],
              alignment: 'right',
              margin: [0, 30, 30, 0]
            }
          ],
        },
        {
          columns: [
            {
              image: this.partnerImage7,
              fit: [100, 60],
              alignment: 'left',
              margin: [80, 30, 0, 0]
            },
            {
              image: this.partnerImage8,
              fit: [100, 60],
              alignment: 'left',
              margin: [10, 25, 25, 0]
            }
          ]
        }
      ],
      styles: {
        tableStyle: {
          alignment: 'center',
          margin: [30, 0, 30, 5]
        },
        tableHeader: {
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 0]
        },
        headerBody: {
          fontSize: 10,
          alignment: 'left',
          margin: [30, 0, 30, 2]
        },
        body: {
          fontSize: 11,
          alignment: 'justify',
          lineHeight: 1.5
        },
        title: {
          bold: true,
          fontSize: 11,
          alignment: 'center',
          margin: [30, 0, 30, 5]
        },
        listItem: {
          bold: true,
          fontSize: 12,
          alignment: 'left',
          margin: [30, 0, 30, 10]
        }
      }
    };

    this.docDefinition = docDefinition;
  }

  getDETERDocumentDefinition() {
    const docDefinition = {
      info: {
        title: 'Relatório DETER'
      },
      pageMargins: [ 30, 30, 30, 30 ],
      footer(currentPage, pageCount) {
        return {
          table: {
            body: [
              [
                {
                  text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                  fontSize: 8,
                  margin: [500, 0, 30, 0]
                }
              ],
            ]
          },
          layout: 'noBorders'
        };
      },
      content: [
        {
          columns: this.getHeaderDocument()
        },
        {
          text: [
            {
              text: 'MUNICÍPIO:',
              bold: true
            },
            {
              text: ` ${this.property.city}-MT`,
              bold: false
            }
          ],
          style: 'headerBody'
        },
        {
          text: [
            {
              text: 'COMARCA:',
              bold: true
            },
            {
              text: ` ${this.property.county}`,
              bold: false
            }
          ],
          style: 'headerBody',
          margin: [30, 0, 30, 20]
        },
        {
          text: 'SATÉLITES ALERTAS – TCT 30/2018 MPMT/INPE',
          color: 'green',
          style: 'title'
        },
        {
          text: `RELATÓRIO TÉCNICO SOBRE ALERTA DE DESMATAMENTO Nº XXXXX/${this.year}`,
          style: 'title',
          margin: [30, 0, 30, 20]
        },
        {
          text: '1 OBJETIVO',
          style: 'listItem'
        },
        {
          text: [
            {
              text: 'Trata-se de relatório técnico sobre desmatamentos ilegais identificados ',
              alignment: 'right',
            },
            {
              text: (
                ' com o uso de Sistema de Informações Geográficas no imóvel rural ' + this.property.name +
                ' (Figura 1), localizado no município de ' + this.property.city +
                '-MT, pertencente a ' + this.property.owner + ', conforme informações declaradas no ' +
                ' Sistema Mato-grossense de Cadastro Ambiental Rural (SIMCAR), protocolo CAR-MT ' + this.property.register
              ),
            },
            {
              text: ' (Anexo 1) ',
              bold: true
            },
            {
              text: (
                '/ acervo fundiário do Instituto Nacional de Colonização e Reforma Agrária (SIGEF/INCRA).'
              )
            }
          ],
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          columns: [
            {
              image: this.geoserverImage1,
              fit: [200, 200],
              margin: [0, 10],
              alignment: 'center'
            },
            {
              image: this.geoserverImage2,
              fit: [200, 200],
              margin: [0, 10],
              alignment: 'center'
            }
          ]
        },
        {
          text: [
            {
              text: 'Figura 1. ',
              bold: true
            },
            {
              text: 'Mapa de Localização e do Perímetro do Imóvel',
              bold: false
            }
          ],
          alignment: 'center',
          fontSize: 10
        },
        {
          text: '2 HISTÓRICO',
          style: 'listItem'
        },
        {
          text: 'As informações sobre os desmatamentos foram integradas no âmbito ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'do Termo de Cooperação Técnica n. 30/2018 firmado entre Ministério Público do Estado de Mato Grosso ' +
            'e Instituto Nacional de Pesquisas Espaciais (INPE), cujo objeto consiste na coleta automática, armazenamento ' +
            'e tratamento de dados geoespaciais para interseções entre produtos do PRODES, DETER e Programa Queimadas do ' +
            'INPE, com os dados de fontes estatais oficiais para quantificação e descrição das áreas afetadas por desmatamento ou queimada.'
          ),
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          columns: this.getHeaderDocument()
        },
        {
          text: '2.1 Dados utilizados',
          style: 'listItem'
        },
        {
          columns: [
            {
              text: 'a) ',
              margin: [50, 0, 0, 15],
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Dados das áreas desmatadas no Estado de Mato Grosso mapeadas pelo Sistema de Detecção de Desmatamento em Tempo Real (DETER) ' +
                '(alertas de desmatamento em tempo quase real) desenvolvido pelo INPE;'
              ),
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'b) ',
              margin: [50, 0, 0, 15],
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Informações e dados geográficos do SIMCAR Parceiros e Público, da Secretaria de Meio Ambiente do Estado de Mato Grosso (SEMA), como: ' +
                'i. Proprietário(s)/posseiro(s); ' +
                'ii. Base de referência do CAR validado; ' +
                'iii. Base de referência do CAR em análise; ' +
                'iv. Base de referência do CAR aguardando complementação; '  +
                'v. Base de referência do CAR cancelado e indeferido; e ' +
                'vi. Base de referência do Programa de Regularização Ambiental (PRA);'
              ),
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'c) ',
              margin: [50, 0, 0, 15],
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Dados do Navegador Geográfico da SEMA (SIMGEO): ' +
                'i. Base de referência das áreas embargadas pela SEMA. ' +
                'ii. Base de referência das áreas desembargadas pela SEMA; ' +
                'iii. Base de referência das Autorizações de Exploração (AUTEX); ' +
                'iv. Base de referência das Autorizações de Desmatamento (AD); ' +
                'v. Base de referência das Áreas de Preservação Permanente (APP), Reserva Legal (ARL), Uso Restrito (AUS) e de Uso Consolidado (AUC);'
              ),
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'd) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: 'Dados do acervo fundiário do Instituto Nacional de Colonização e Reforma Agrária (SIGEF/INCRA);',
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'e) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Dados geográficos das Unidades de Conservação (UC) no Estado de Mato Grosso, disponíveis no Cadastro Nacional de Unidades ' +
                'de Conservação do Ministério de Meio Ambiente (MMA);'
              ),
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'f) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Dados geográficos das Terras Indígenas no Estado de Mato Grosso, disponíveis no sítio eletrônico da Fundação Nacional do Índio (FUNAI);'
              ),
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'g) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Mapa de vegetação do Projeto RadamBrasil;'
              ),
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'h) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: 'Imagens dos Satélites Landsat, SPOT, Planet, Sentinel-2, CBERS-4 e de outras fontes disponíveis;',
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'i) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: 'Dados pessoais dos responsáveis pelo imóvel rural obtidos no Sistema Nacional de Informações de Segurança Pública (SINESP-INFOSEG).',
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          columns: this.getHeaderDocument()
        },
        {
          text: '2.2 Método utilizado',
          style: 'listItem'
        },
        {
          text: 'Todas as informações acima descritas foram integradas utilizando a ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'plataforma computacional TerraMA2. Essa plataforma foi desenvolvida pelo INPE para o monitoramento, ' +
            'análise e emissão de alertas sobre extremos ambientais¹. Assim, utilizando esta base tecnológica inovadora, ' +
            'no domínio de softwares abertos, as tarefas executadas pela plataforma foram definidas para coletar, ' +
            'analisar (intersecção de geometrias dos mapas), visualizar e consultar dados sobre danos ambientais causados ' +
            'por desmatamentos recentes. Para isso, dados dinâmicos e estáticos foram processados para produzirem as informações ' +
            'que foram sistematizadas neste relatório.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Os dados de desmatamentos (polígonos) do Sistema DETER foram cruzados ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'com informações geoespaciais de fontes oficiais para identificação e quantificação ' +
            'dos danos ambientais causados por desmatamentos supostamente ilegais, bem como para ' +
            'identificação dos responsáveis pelo imóvel rural atingido, para fins de responsabilização civil, administrativa ' +
            'e, eventualmente, criminal pelos danos causados.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'As informações sobre o imóvel rural onde incidiu o desmatamento e',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: ' sua titularidade foram coletadas na base de dados do SIMCAR e/ou INCRA.',
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Para qualificação da área desmatada, o tipo de vegetação foi ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'identificado utilizando o mapa de vegetação do Projeto RadamBrasil.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Os dados geoespaciais do SIMGEO, MMA e FUNAI foram cruzados ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'com os dados do INPE para identificação e quantificação dos desmatamentos em áreas protegidas ' +
            '(APP, ARL, AUR, UC e TI), bem como para identificar ilícitos ambientais, mediante o cruzamento ' +
            'com dados das Autorizações de Exploração (AUTEX) e de Desmatamento (AD) emitidas pela SEMA.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: '2.2.1 Sistema de Detecção de Desmatamento em Tempo Real (DETER)',
          style: 'listItem'
        },
        {
          text: 'Os projetos PRODES e DETER, utilizados para identificação e ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'quantificação dos desmatamentos, fazem parte do Programa de Monitoramento da Amazônia e '
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: (
            'Demais Biomas (PAMZ+)' +
            'desenvolvido pela Coordenação-geral de Observação da Terra (CGOBT) e Centro Regional da Amazônia (CRA) do INPE. ' +
            'Além do PRODES e DETER, o PAMZ+ conta também com o Sistema de Mapeamento do Uso e Ocupação da Terra (TerraClass). ' +
            'Estes três projetos são complementares e concebidos para atender diferentes objetivos.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          columns: this.getHeaderDocument()
        },
        {
          text: 'O objetivo do DETER é identificar as alterações da vegetação natural ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'em biomas da Amazônia Legal (Amazônia e Cerrado), em áreas acima de 3 ha, com a emissão de alertas para apoio ' +
            'à fiscalização em tempo quase real. Para fisionomias florestais no bioma Amazônia, os alertas indicam áreas que ' +
            'sofreram corte raso ou intervenções pela exploração madeireira, mineração ou queimadas, ou seja, identificam e ' +
            'mapeiam áreas desflorestadas e degradadas, enquanto para o bioma Cerrado, é identificada apenas o corte raso da vegetação natural.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'O DETER é operado com imagens do sensor WFI do satélite CBERS-4 do INPE/CRESDA ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            '(Brasil/China), com resolução espacial de 64m e quatro bandas espectrais (azul, verde, ' +
            'vermelho e infravermelho próximo). Para isso, as frações de solo, vegetação e sombra em uma ' +
            'imagem são estimadas a partir do Modelo Linear de Mistura Espectral (MLME), a fim de realçar ' +
            'feições de extração seletiva de madeira e de queimadas, que fazem parte do processo de desmatamento.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Assim, no âmbito do DETER, diariamente são escolhidas imagens com ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'menor cobertura de nuvens e feita a composição' +
            'das bandas espectrais mais sensíveis às respostas da contribuição do solo e da vegetação para realçar áreas de ' +
            'desmatamento, que são identificadas por fotointerpretação considerando a tonalidade, textura e contexto da área ' +
            'na imagem de satélite processada. Com essa metodologia, o sistema é capaz de diferenciar impactos naturais de antrópicos, ' +
            'em razão das feições das áreas analisadas. O tempo entre o mapeamento dos alertas, validação e inclusão no banco de dados ' +
            'é de aproximadamente 72 horas.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Os dados do INPE constituem fonte de acentuada importância para a ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'gestão ambiental, e já embasaram importantes acordos com setores ligados ao agronegócio, como o ' +
            'Termo de Ajustamento de Conduta (TAC) da carne, Moratória da Soja e outros acordos intergovernamentais, como ' +
            'o feito na Conferência das Nações Unidas Sobre Mudanças Climáticas (COP21) para a redução das emissões de gases ' +
            'de efeito estufa por desflorestamento e degradação florestal1. Ainda, a importância e credibilidade dos dados gerados ' +
            'pelo INPE é refletida pelas milhares de publicações científicas que utilizaram essas informações para realização de ' +
            'pesquisas, que podem ser encontrada no Google Scholar².'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: '3 ANÁLISE TÉCNICA',
          style: 'listItem'
        },
        {
          text: 'A partir do sistema Satélites Alertas foram obtidos os alertas DETER ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'detectados no período entre XX/XX/XXXX a XX/XX/XXXX. ' +
            'Dessa forma, seguem abaixo as informações sobre os desmatamentos.'
          ),
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          columns: this.getHeaderDocument()
        },
        {
          text: [
            {
              text: 'Quadro 1 ',
              alignment: 'right',
              margin: [30, 0, 30, 0],
              bold: true
            },
            {
              text: `- Classes e quantitativos de áreas desmatadas e queimadas no imóvel rural`,
              alignment: 'right',
              margin: [30, 0, 30, 0],
              bold: false
            }
          ],
          fontSize: 10
        },
        {
          text: ' denominado ' + this.property.name + '.',
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          style: 'tableStyle',
          table: {
            widths: [ '*', '*' ],
            headerRows: 1,
            body: [
              [
                {
                  text: 'Área atingida',
                  style: 'tableHeader'
                },
                {
                  text: 'Desmatamento recente\n(DETER – nº de alertas)',
                  style: 'tableHeader'
                }
              ],
              ...this.tableData.map(rel => {
                return [
                        rel.affectedArea,
                        rel.recentDeforestation
                ];
              })
            ]
          },
          fontSize: 12
        },
        {
          text: '4 CONCLUSÃO',
          margin: [30, 20, 30, 0],
          style: 'listItem'
        },
        {
          text: `${this.property.foundDeter ? 'Houve' : 'Não houve'} desmatamento ilegal no imóvel rural objeto deste Relatório `,
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: 'Técnico, conforme descrito no Quadro 01 (vide item 3. Análise Técnica).',
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          text: '5 ANEXOS',
          style: 'listItem'
        },
        {
          text: [
            {
              text: 'Anexo 1.',
              style: 'body',
              bold: true
            },
            {
              text: ' – Informações sobre o CAR-MT ' + this.property.register + ';',
              style: 'body'
            }
          ],
          margin: [30, 0, 30, 0]
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          columns: this.getHeaderDocument()
        },
        {
          text: '6 VALIDAÇÃO',
          margin: [30, 20, 30, 0],
          style: 'listItem'
        },
        {
          text: `Este relatório técnico foi validado em ${this.currentDate} por: `,
          margin: [30, 0, 30, 100],
          alignment: 'center',
          style: 'body'
        },
        {
          text: 'Relatório técnico produzido em parceria com: ',
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          columns: [
            {
              image: this.partnerImage1,
              fit: [180, 50],
              alignment: 'left',
              margin: [30, 0, 0, 0]
            },
            {
              image: this.partnerImage2,
              fit: [100, 50],
              alignment: 'center',
              margin: [0, 0, 0, 0]
            },
            {
              image: this.partnerImage3,
              fit: [80, 50],
              alignment: 'right',
              margin: [0, 0, 40, 0]
            }
          ]
        },
        {
          columns: [
            {
              image: this.partnerImage4,
              fit: [130, 60],
              alignment: 'left',
              margin: [80, 30, 0, 0]
            },
            {
              image: this.partnerImage5,
              fit: [100, 60],
              alignment: 'center',
              margin: [95, 30, 0, 0]
            },
            {
              image: this.partnerImage6,
              fit: [100, 60],
              alignment: 'right',
              margin: [0, 30, 30, 0]
            }
          ],
        },
        {
          columns: [
            {
              image: this.partnerImage7,
              fit: [100, 60],
              alignment: 'left',
              margin: [80, 30, 0, 0]
            },
            {
              image: this.partnerImage8,
              fit: [100, 60],
              alignment: 'left',
              margin: [10, 25, 25, 0]
            }
          ]
        }
      ],
      styles: {
        tableStyle: {
          alignment: 'center',
          margin: [30, 0, 30, 5]
        },
        tableHeader: {
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 0]
        },
        headerBody: {
          fontSize: 10,
          alignment: 'left',
          margin: [30, 0, 30, 2]
        },
        body: {
          fontSize: 11,
          alignment: 'justify',
          lineHeight: 1.5
        },
        title: {
          bold: true,
          fontSize: 11,
          alignment: 'center',
          margin: [30, 0, 30, 5]
        },
        listItem: {
          bold: true,
          fontSize: 12,
          alignment: 'left',
          margin: [30, 0, 30, 10]
        }
      }
    };

    this.docDefinition = docDefinition;
  }

  getQUEIMADAocumentDefinition() {
    const docDefinition = {
      info: {
        title: 'Relatório QUEIMADA'
      },
      pageMargins: [ 30, 30, 30, 30 ],
      footer(currentPage, pageCount) {
        return {
          table: {
            body: [
              [
                {
                  text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                  fontSize: 8,
                  margin: [500, 0, 30, 0]
                }
              ],
            ]
          },
          layout: 'noBorders'
        };
      },
      content: [
        {
          columns: this.getHeaderDocument()
        },
        {
          text: [
            {
              text: 'MUNICÍPIO:',
              bold: true
            },
            {
              text: ` ${this.property.city}-MT`,
              bold: false
            }
          ],
          style: 'headerBody'
        },
        {
          text: [
            {
              text: 'COMARCA:',
              bold: true
            },
            {
              text: ` ${this.property.county}`,
              bold: false
            }
          ],
          style: 'headerBody',
          margin: [30, 0, 30, 20]
        },
        {
          text: 'SATÉLITES ALERTAS – TCT 30/2018 MPMT/INPE',
          color: 'green',
          style: 'title'
        },
        {
          text: `RELATÓRIO TÉCNICO SOBRE CICATRIZ DE QUEIMADA Nº XXXXX/${this.year}`,
          style: 'title',
          margin: [30, 0, 30, 20]
        },
        {
          text: '1 OBJETIVO',
          style: 'listItem'
        },
        {
          text: [
            {
              text: 'Trata-se de relatório técnico sobre cicatriz de queimada identificada ',
              alignment: 'right',
            },
            {
              text: (
                ' com o uso de Sistema de Informações Geográficas no imóvel rural ' + this.property.name +
                ' (Figura 1), localizada no município de ' + this.property.city +
                '-MT, pertencente a ' + this.property.owner + ', conforme informações declaradas no ' +
                ' Sistema Mato-grossense de Cadastro Ambiental Rural (SIMCAR), protocolo CAR-MT ' + this.property.register
              ),
            },
            {
              text: ' (Anexo 1) ',
              bold: true
            },
            {
              text: (
                '/ acervo fundiário do Instituto Nacional de Colonização e Reforma Agrária (SIGEF/INCRA).'
              )
            }
          ],
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          columns: [
            {
              image: this.geoserverImage1,
              fit: [200, 200],
              margin: [0, 10],
              alignment: 'center'
            },
            {
              image: this.geoserverImage2,
              fit: [200, 200],
              margin: [0, 10],
              alignment: 'center'
            }
          ]
        },
        {
          text: [
            {
              text: 'Figura 1. ',
              bold: true
            },
            {
              text: 'Mapa de Localização e do Perímetro do Imóvel',
              bold: false
            }
          ],
          alignment: 'center',
          fontSize: 10
        },
        {
          text: '2 HISTÓRICO',
          style: 'listItem'
        },
        {
          text: 'As informações sobre os desmatamentos foram integradas no âmbito ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'do Termo de Cooperação Técnica n. 30/2018 firmado entre Ministério Público do Estado de Mato Grosso ' +
            'e Instituto Nacional de Pesquisas Espaciais (INPE), cujo objeto consiste na coleta automática, armazenamento ' +
            'e tratamento de dados geoespaciais para interseções entre produtos do PRODES, DETER e Programa Queimadas do ' +
            'INPE, com os dados de fontes estatais oficiais para quantificação e descrição das áreas afetadas por desmatamento ou queimada.'
          ),
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          columns: this.getHeaderDocument()
        },
        {
          text: '2.1 Dados utilizados',
          style: 'listItem'
        },
        {
          columns: [
            {
              text: 'a) ',
              margin: [50, 0, 0, 15],
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Dados das áreas queimadas no Estado de Mato Grosso mapeadas pelo Programa Queimadas (ocorrência de fogo e cicatrizes das áreas queimadas) ' +
                '(alertas de desmatamento em tempo quase real) desenvolvido pelo INPE;'
              ),
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'b) ',
              margin: [50, 0, 0, 15],
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Informações e dados geográficos do SIMCAR Parceiros e Público, da Secretaria de Meio Ambiente do Estado de Mato Grosso (SEMA), como: ' +
                'i. Proprietário(s)/posseiro(s); ' +
                'ii. Base de referência do CAR validado; ' +
                'iii. Base de referência do CAR em análise; ' +
                'iv. Base de referência do CAR aguardando complementação; '  +
                'v. Base de referência do CAR cancelado e indeferido; e ' +
                'vi. Base de referência do Programa de Regularização Ambiental (PRA);'
              ),
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'c) ',
              margin: [50, 0, 0, 15],
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Dados do Navegador Geográfico da SEMA (SIMGEO): ' +
                'i. Base de referência das áreas embargadas pela SEMA. ' +
                'ii. Base de referência das áreas desembargadas pela SEMA; ' +
                'iii. Base de referência das Autorizações de Exploração (AUTEX); ' +
                'iv. Base de referência das Autorizações de Desmatamento (AD); ' +
                'v. Base de referência das Áreas de Preservação Permanente (APP), Reserva Legal (ARL), Uso Restrito (AUS) e de Uso Consolidado (AUC);'
              ),
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'd) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: 'Dados do acervo fundiário do Instituto Nacional de Colonização e Reforma Agrária (SIGEF/INCRA);',
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'e) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Dados geográficos das Unidades de Conservação (UC) no Estado de Mato Grosso, disponíveis no Cadastro Nacional de Unidades ' +
                'de Conservação do Ministério de Meio Ambiente (MMA);'
              ),
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'f) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Dados geográficos das Terras Indígenas no Estado de Mato Grosso, disponíveis no sítio eletrônico da Fundação Nacional do Índio (FUNAI);'
              ),
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'g) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: (
                'Imagens dos Satélites Landsat, SPOT, Planet, Sentinel-2, CBERS-4 e de outras fontes que estiverem disponíveis;'
              ),
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'h) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: 'Dados pessoais dos responsáveis pelo imóvel rural obtidos no Sistema Nacional de Informações de Segurança Pública (SINESP-INFOSEG).',
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          columns: this.getHeaderDocument()
        },
        {
          text: '2.2 Método utilizado',
          style: 'listItem'
        },
        {
          text: 'Todas as informações acima descritas foram integradas utilizando a ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'plataforma computacional TerraMA2. Essa plataforma foi desenvolvida pelo INPE para o monitoramento, ' +
            'análise e emissão de alertas sobre extremos ambientais¹. Assim, utilizando esta base tecnológica inovadora, ' +
            'no domínio de softwares abertos, as tarefas executadas pela plataforma foram definidas para coletar, ' +
            'analisar (intersecção de geometrias dos mapas), visualizar e consultar dados sobre danos ambientais causados ' +
            'por queimadas. Para isso, dados dinâmicos e estáticos foram processados para produzirem as informações ' +
            'que foram sistematizadas neste relatório.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Os dados do Programa Queimadas (pontos e polígonos ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'representando a área nominal do píxel de fogo, bem como os polígonos das cicatrizes das áreas queimadas), foram' +
            'cruzados com informações geoespaciais de fontes oficiais para identificação e quantificação dos danos ambientais' +
            'causados pelas queimadas, bem como para identificação dos responsáveis pelo imóvel rural atingido, para fins de' +
            'responsabilização civil e, eventualmente, criminal pelos danos causados.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'As informações sobre o imóvel rural onde incidiu a queimada e',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: ' sua titularidade foram coletadas na base de dados do SIMCAR e/ou INCRA.',
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Para qualificação da área desmatada, o tipo de vegetação foi ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'identificado utilizando o mapa de vegetação do Projeto RadamBrasil.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Os dados geoespaciais do SIMGEO, MMA e FUNAI foram cruzados ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'com os dados do INPE para identificação e quantificação dos desmatamentos em áreas protegidas ' +
            '(APP, ARL, AUR, UC e TI), bem como para identificar ilícitos ambientais, mediante o cruzamento ' +
            'com dados das Autorizações de Exploração (AUTEX) e de Desmatamento (AD) emitidas pela SEMA.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: '2.2.1 Sistema de Detecção de Desmatamento em Tempo Real (DETER)',
          style: 'listItem'
        },
        {
          text: 'Os projetos PRODES e DETER, utilizados para identificação e ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'quantificação dos desmatamentos, fazem parte do Programa de Monitoramento da Amazônia e '
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: (
            'Demais Biomas (PAMZ+)' +
            'desenvolvido pela Coordenação-geral de Observação da Terra (CGOBT) e Centro Regional da Amazônia (CRA) do INPE. ' +
            'Além do PRODES e DETER, o PAMZ+ conta também com o Sistema de Mapeamento do Uso e Ocupação da Terra (TerraClass). ' +
            'Estes três projetos são complementares e concebidos para atender diferentes objetivos.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          columns: this.getHeaderDocument()
        },
        {
          text: 'O objetivo do DETER é identificar as alterações da vegetação natural ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'em biomas da Amazônia Legal (Amazônia e Cerrado), em áreas acima de 3 ha, com a emissão de alertas para apoio ' +
            'à fiscalização em tempo quase real. Para fisionomias florestais no bioma Amazônia, os alertas indicam áreas que ' +
            'sofreram corte raso ou intervenções pela exploração madeireira, mineração ou queimadas, ou seja, identificam e ' +
            'mapeiam áreas desflorestadas e degradadas, enquanto para o bioma Cerrado, é identificada apenas o corte raso da vegetação natural.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'O DETER é operado com imagens do sensor WFI do satélite CBERS-4 do INPE/CRESDA ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            '(Brasil/China), com resolução espacial de 64m e quatro bandas espectrais (azul, verde, ' +
            'vermelho e infravermelho próximo). Para isso, as frações de solo, vegetação e sombra em uma ' +
            'imagem são estimadas a partir do Modelo Linear de Mistura Espectral (MLME), a fim de realçar ' +
            'feições de extração seletiva de madeira e de queimadas, que fazem parte do processo de desmatamento.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Assim, no âmbito do DETER, diariamente são escolhidas imagens com ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'menor cobertura de nuvens e feita a composição' +
            'das bandas espectrais mais sensíveis às respostas da contribuição do solo e da vegetação para realçar áreas de ' +
            'desmatamento, que são identificadas por fotointerpretação considerando a tonalidade, textura e contexto da área ' +
            'na imagem de satélite processada. Com essa metodologia, o sistema é capaz de diferenciar impactos naturais de antrópicos, ' +
            'em razão das feições das áreas analisadas. O tempo entre o mapeamento dos alertas, validação e inclusão no banco de dados ' +
            'é de aproximadamente 72 horas.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Os dados do INPE constituem fonte de acentuada importância para a ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'gestão ambiental, e já embasaram importantes acordos com setores ligados ao agronegócio, como o ' +
            'Termo de Ajustamento de Conduta (TAC) da carne, Moratória da Soja e outros acordos intergovernamentais, como ' +
            'o feito na Conferência das Nações Unidas Sobre Mudanças Climáticas (COP21) para a redução das emissões de gases ' +
            'de efeito estufa por desflorestamento e degradação florestal1. Ainda, a importância e credibilidade dos dados gerados ' +
            'pelo INPE é refletida pelas milhares de publicações científicas que utilizaram essas informações para realização de ' +
            'pesquisas, que podem ser encontrada no Google Scholar².'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: '3 ANÁLISE TÉCNICA',
          style: 'listItem'
        },
        {
          text: 'A partir do sistema Satélites Alertas foram obtidos os alertas DETER ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'detectados no período entre XX/XX/XXXX a XX/XX/XXXX. ' +
            'Dessa forma, seguem abaixo as informações sobre os desmatamentos.'
          ),
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          columns: this.getHeaderDocument()
        },
        {
          text: [
            {
              text: 'Quadro 1 ',
              alignment: 'right',
              margin: [30, 0, 30, 0],
              bold: true
            },
            {
              text: `- Classes e quantitativos de áreas desmatadas e queimadas no imóvel rural`,
              alignment: 'right',
              margin: [30, 0, 30, 0],
              bold: false
            }
          ],
          fontSize: 10
        },
        {
          text: ' denominado ' + this.property.name + '.',
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          style: 'tableStyle',
          table: {
            widths: [ '*', '*' ],
            headerRows: 1,
            body: [
              [
                {
                  text: 'Área atingida',
                  style: 'tableHeader'
                },
                {
                  text: 'Desmatamento recente\n(DETER – nº de alertas)',
                  style: 'tableHeader'
                }
              ],
              ...this.tableData.map(rel => {
                return [
                        rel.affectedArea,
                        rel.recentDeforestation
                ];
              })
            ]
          },
          fontSize: 12
        },
        {
          text: '4 CONCLUSÃO',
          margin: [30, 20, 30, 0],
          style: 'listItem'
        },
        {
          text: `${this.property.foundDeter ? 'Houve' : 'Não houve'} desmatamento ilegal no imóvel rural objeto deste Relatório `,
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: 'Técnico, conforme descrito no Quadro 01 (vide item 3. Análise Técnica).',
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          text: '5 ANEXOS',
          style: 'listItem'
        },
        {
          text: [
            {
              text: 'Anexo 1.',
              style: 'body',
              bold: true
            },
            {
              text: ' – Informações sobre o CAR-MT ' + this.property.register + ';',
              style: 'body'
            }
          ],
          margin: [30, 0, 30, 0]
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          columns: this.getHeaderDocument()
        },
        {
          text: '6 VALIDAÇÃO',
          margin: [30, 20, 30, 0],
          style: 'listItem'
        },
        {
          text: `Este relatório técnico foi validado em ${this.currentDate} por: `,
          margin: [30, 0, 30, 100],
          alignment: 'center',
          style: 'body'
        },
        {
          text: 'Relatório técnico produzido em parceria com: ',
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          columns: [
            {
              image: this.partnerImage1,
              fit: [180, 50],
              alignment: 'left',
              margin: [30, 0, 0, 0]
            },
            {
              image: this.partnerImage2,
              fit: [100, 50],
              alignment: 'center',
              margin: [0, 0, 0, 0]
            },
            {
              image: this.partnerImage3,
              fit: [80, 50],
              alignment: 'right',
              margin: [0, 0, 40, 0]
            }
          ]
        },
        {
          columns: [
            {
              image: this.partnerImage4,
              fit: [130, 60],
              alignment: 'left',
              margin: [80, 30, 0, 0]
            },
            {
              image: this.partnerImage5,
              fit: [100, 60],
              alignment: 'center',
              margin: [95, 30, 0, 0]
            },
            {
              image: this.partnerImage6,
              fit: [100, 60],
              alignment: 'right',
              margin: [0, 30, 30, 0]
            }
          ],
        },
        {
          columns: [
            {
              image: this.partnerImage7,
              fit: [100, 60],
              alignment: 'left',
              margin: [80, 30, 0, 0]
            },
            {
              image: this.partnerImage8,
              fit: [100, 60],
              alignment: 'left',
              margin: [10, 25, 25, 0]
            }
          ]
        }
      ],
      styles: {
        tableStyle: {
          alignment: 'center',
          margin: [30, 0, 30, 5]
        },
        tableHeader: {
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 0]
        },
        headerBody: {
          fontSize: 10,
          alignment: 'left',
          margin: [30, 0, 30, 2]
        },
        body: {
          fontSize: 11,
          alignment: 'justify',
          lineHeight: 1.5
        },
        title: {
          bold: true,
          fontSize: 11,
          alignment: 'center',
          margin: [30, 0, 30, 5]
        },
        listItem: {
          bold: true,
          fontSize: 12,
          alignment: 'left',
          margin: [30, 0, 30, 10]
        }
      }
    };

    this.docDefinition = docDefinition;
  }
}
