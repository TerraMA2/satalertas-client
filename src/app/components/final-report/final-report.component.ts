import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { HTTPService } from 'src/app/services/http.service';

import { ConfigService } from 'src/app/services/config.service';

import { SidebarService } from 'src/app/services/sidebar.service';

import { Property } from 'src/app/models/property.model';

import {MapService} from '../../services/map.service';

import {ReportService} from '../../services/report.service';

import { Response } from 'src/app/models/response.model';

declare let pdfMake: any ;

@Component({
  selector: 'app-final-report',
  templateUrl: './final-report.component.html',
  styleUrls: ['./final-report.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FinalReportComponent implements OnInit {

  private reportConfig;

  private image64mpmt;
  private image64mpmt1;
  private image64mpmt2;
  private image64mpmt3;
  private image64mpmt4;

  private imageHeader;
  private imageHeader1;
  private imageHeader2;

  property;

  carRegister: string;

  dateFilter: string;

  formattedFilterDate: string;

  currentYear: number;
  prodesStartYear: string;

  tableColumns;

  type: string;
  year: string;

  tableData;

  bbox: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private hTTPService: HTTPService,
    private configService: ConfigService,
    private sidebarService: SidebarService,
    private reportService: ReportService
  ) {}

  async ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.carRegister = params.carRegister;
      this.type = params.type;
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

  getReportData() {
    const date = JSON.parse(localStorage.getItem('dateFilter'));
    this.dateFilter = `${date[0]}/${date[1]}`;
    const startDate = new Date(date[0]).toLocaleDateString('pt-BR');
    const endDate = new Date(date[1]).toLocaleDateString('pt-BR');

    this.formattedFilterDate = `${startDate} - ${endDate}`;

    this.currentYear = new Date().getFullYear();

    const filter = localStorage.getItem('filterList');

    const propertyConfig = this.reportConfig.propertyData;
    const url = propertyConfig.url;
    const viewId = propertyConfig.viewId;
    this.carRegister = this.carRegister.replace('\\', '/');
    const carRegister = this.carRegister;
    this.hTTPService.get(url, {viewId, carRegister, date, filter})
                    .subscribe((reportData: Property) => {
      this.prodesStartYear = reportData.prodesYear[0]['date'];

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

      const gsImage = `http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_5:view5,terrama2_5:view5,terrama2_6:view6&styles=&bbox=-61.6904258728027,-18.0950622558594,-50.1677627563477,-7.29556512832642&width=250&height=250&cql_filter=id_munic>0;municipio='${this.property.city}';numero_do1='${this.property.register}'&srs=EPSG:4326&format=image/png`;
      const gsImage1 = `http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_6:view6&styles=&bbox=${this.property.bbox}&width=400&height=400&time=${this.property.prodesYear[0]['date']}/P1Y&cql_filter=numero_do1='${this.property.register}'&srs=EPSG:4326&format=image/png`;
      const gsImage2 = `http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_6:view6,terrama2_73:view73&styles=&bbox=${this.property.bbox}&width=404&height=431&time=${this.property.prodesYear[0]['date']}/${this.currentYear}&cql_filter=numero_do1='${this.property.register}';de_car_validado_sema_numero_do1='${this.property.register}'&srs=EPSG:4674&format=image/png`;
      const gsImage3 = `http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_6:MosaicSpot2008_car_validado&styles=&bbox=${this.property.bbox}&width=400&height=400&time=${this.prodesStartYear}/P1Y&cql_filter=numero_do1='${this.property.register}'&srs=EPSG:4326&format=image/png`;
      const gsImage4 = `http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_6:view6,terrama2_73:view73&styles=&bbox=${this.property.bbox}&width=400&height=400&time=${this.currentYear}/P1Y&cql_filter=numero_do1='${this.property.register}';de_car_validado_sema_numero_do1='${this.property.register}'&srs=EPSG:4674&format=image/png`;

      this.image64mpmt = this.getBaseImageUrl(gsImage);
      this.image64mpmt1 = this.getBaseImageUrl(gsImage1);
      this.image64mpmt2 = this.getBaseImageUrl(gsImage2);
      this.image64mpmt3 = this.getBaseImageUrl(gsImage3);
      this.image64mpmt4 = this.getBaseImageUrl(gsImage4);

      this.imageHeader = this.getBaseImage('assets/img/logos/logo-mpmt2.png');
      this.imageHeader1 = this.getBaseImage('assets/img/logos/logo-report-procuradoria-small.png');
      this.imageHeader2 = this.getBaseImage('assets/img/logos/logo-report-inpe.png');

    });
  }

  async getBase64ImageFromUrl(imageUrl) {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader  = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.onerror = () => reject(this);
      reader.readAsDataURL(blob);
    });
  }

  getBaseImageUrl(url: string) {
    const baseImage = [];
    this.getBase64ImageFromUrl(url).then(result => baseImage.push(result)).catch(err => console.error(err));
    return baseImage;
  }

  toDataUrl(file, callback) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result);
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', file);
    xhr.send();
  }

  getBaseImage(fileLocation: string) {
    const baseImage = [];
    this.toDataUrl(fileLocation, base64Image => baseImage.push(base64Image));
    return baseImage;
  }

  getHeaderDocument() {
    return [
      {
        image: this.imageHeader,
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
        image: this.imageHeader1,
        width: 80,
        height: 80,
        alignment: 'right',
        margin: [0, 15, 0, 20]
      },
      {
        image: this.imageHeader2,
        width: 80,
        height: 80,
        alignment: 'right',
        margin: [0, 15, 0, 20]
      },
    ];
  }

  generatePdf(action = 'open') {
    const report = this.getDocumentDefinition();

    this.reportService.generatePdf(report).then( (response: Response) => {
      const reportResp = (response.status === 200) ? response.data : {};
      if (response.status === 200) {
        window.open(window.URL.createObjectURL(this.base64toBlob(reportResp.base64, 'application/pdf')));
      } else {
        alert(`${response.status} - ${response.message}`);
      }
    });
  /*
      switch (action) {
        case 'open': pdfMake.createPdf(documentDefinition).open(); break;
        case 'print': pdfMake.createPdf(documentDefinition).print(); break;
        case 'download': pdfMake.createPdf(documentDefinition).download(); break;
        default: pdfMake.createPdf(documentDefinition).open(); break;
      }
  */
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

  getDocumentDefinition() {
    return {
      info: {
        title: 'relatorio'
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
              text: 'NOTÍCIA DE FATO SIMP:',
              bold: true
            },
            {
              text: ' ',
              bold: false
            }
          ],
          style: 'headerBody'
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
<<<<<<< HEAD
          text: 'RELATÓRIO Nº 00001/2019',
=======
          text: 'RELATÓRIO TÉCNICO DE DESMATAMENTO Nº 000001/2019',
>>>>>>> ed87e8fc9af609f10236a0f553aad6e8eb103ab4
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
                'com o uso de Sistema de Informações Geográficas no imóvel rural ' + this.property.name +
                ' (Figura 1), localizado no município de ' + this.property.city +
                '-MT, pertencente a ' + this.property.owner + ', conforme informações declaradas no ' +
                'Sistema Mato-grossense de Cadastro Ambiental Rural (SIMCAR), protocolo CAR-MT ' + this.property.register +
                '/' + this.currentYear
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
              image: this.image64mpmt,
              fit: [200, 200],
              margin: [0, 10],
              alignment: 'center'
            },
            {
              image: this.image64mpmt1,
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
          text: 'As informações sobre os desmatamentos foram integradas no âmbito',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'do Termo de Cooperação Técnica n. 30/2018 firmado entre Ministério Público do Estado de Mato Grosso' +
            'e Instituto Nacional de Pesquisas Espaciais (INPE), cujo objeto consiste na coleta automática, armazenamento' +
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
                'Dados das áreas desmatadas no Estado de Mato Grosso mapeadas pelo Programa de Monitoramento da Floresta' +
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
                'Informações e dados geográficos do SIMCAR Parceiros e Público, da Secretaria de Meio Ambiente do Estado de Mato Grosso (SEMA), como:' +
                'i. Proprietário(s)/posseiro(s);' +
                'ii. Base de referência do CAR validado;' +
                'iii. Base de referência do CAR em análise;' +
                'iv. Base de referência do CAR aguardando complementação;'  +
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
                'Dados do Navegador Geográfico da SEMA (SIMGEO):' +
                'i. Base de referência das áreas embargadas pela SEMA.' +
                'ii. Base de referência das áreas desembargadas pela SEMA; ' +
                'iii. Base de referência das Autorizações de Exploração (AUTEX);' +
                'iv. Base de referência das Autorizações de Desmatamento (AD);' +
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
                'Dados geográficos das Unidades de Conservação (UC) no Estado de Mato Grosso, disponíveis no Cadastro Nacional de Unidades' +
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
          columns: this.getHeaderDocument()
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
          text: 'Todas as informações acima descritas foram integradas utilizando a',
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
            'por desmatamentos e queimadas. Para isso, dados dinâmicos e estáticos foram processados para produzirem as informações' +
            'que foram sistematizadas neste relatório.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Os dados de desmatamentos (polígonos) do PRODES foram cruzados',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'com informações geoespaciais de fontes oficiais para identificação e quantificação' +
            'dos danos ambientais causados por desmatamentos supostamente ilegais, bem como para' +
            'identificação dos responsáveis pelo imóvel rural atingido, para fins de responsabilização civil, administrativa' +
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
          text: 'Para qualificação da área desmatada, o tipo de vegetação foi',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            ' identificado utilizando o mapa de vegetação do Projeto RadamBrasil.'
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
            'com os dados do INPE para identificação e quantificação dos desmatamentos ao longo dos anos' +
            'em áreas protegidas (APP, ARL, AUR, UC e TI), bem como para identificar ilícitos ambientais, mediante' +
            'o cruzamento com dados das Autorizações de Exploração (AUTEX) e de Desmatamento (AD) emitidas pela SEMA.' +
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
          columns: this.getHeaderDocument()
        },
        {
          text: 'Por fim, foi gerado um relatório com o histórico de imagens de',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'satélites e dos desmatamentos e queimadas ocorridos no imóvel rural, contendo ainda, o perfil' +
            'histórico de NDVI e EVI das áreas desmatadas, a fim de melhorar a interpretação das intervenções' +
            'antrópicas ocorridas. As séries temporais de índices vegetativos representam as variações de biomassa, sendo' +
            'que o perfil ao longo de um ciclo hidrológico varia dependendo do tipo de vegetação, impactos ou uso alternativo da área.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'De acordo com o Sistema de Análise Temporal da Vegetação',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            '(SATVeg) da Empresa Brasileira de Pesquisa Agropecuária (EMBRAPA), os índices vegetativos' +
            'NDVI e EVI são derivados das imagens do sensor MODIS, a bordo dos satélites Terra e Aqua.' +
            'As imagens são adquiridas do Land Processes Distributed Active Center (LP-DAAC), que está ' +
            'vinculada a NASA\'s Earth Observing System (NASA EOS). As séries temporais dos índices vegetativos' +
            'fazem parte da coleção 6 dos produtos MOD13Q1 (satélite Terra, com início em 18/02/2000)' +
            'e MYD13Q1 (satélite Aqua, com início em 04/07/2002). Nestes produtos, o NDVI e o EVI são disponibilizados' +
            'em composições máximas de 16 dias, com resolução espacial de aproximadamente 250m. Como exemplo, nas figuras' +
            'abaixo podem ser observados os padrões gráficos do NDVI para floresta ombrófila densa, cerrado e quando da ' +
            'ocorrência de desmatamento. Mais informações sobre os padrões de perfis gráficos dos índices de vegetação, incluindo' +
            'os padrões de culturas agrícolas, podem ser consultadas no sítio eletrônico do SATVeg1.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          image: this.chart1,
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
                'nos valores dos índices de vegetação ao longo do ano. Além disso, esta cobertura apresenta valores elevados dos índices' +
                'de vegetação durante o ano, em função da grande biomassa vegetal presente.'
              ),
              bold: false
            }
          ],
          margin: [30, 0, 30, 0],
          alignment: 'center',
          fontSize: 10,
          style: 'body'
        },
        {
          image: this.chart2,
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
                'Cerrado - Em função do clima sazonal, com verões chuvosos e invernos mais secos, essa cobertura vegetal apresenta' +
                'oscilações significativas nos valores dos índices de vegetação ao longo do ano e, geralmente, apresenta valores intermediários' +
                'no período chuvoso. Durante o inverno, com a queda das precipitações e a redução da biomassa vegetal ativa, os índices de vegetação' +
                'declinam significativamente, retomando seu vigor apenas com a volta do período de chuvas.'
              ),
              bold: false
            }
          ],
          margin: [30, 0, 30, 0],
          alignment: 'center',
          fontSize: 10,
          style: 'body'
        },
        {
          image: this.chart3,
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
                'Desmatamento - Como as florestas apresentam valores de índice de vegetação mais elevados, com' +
                'ou sem a presença de alguma variação pela sazonalidade, a depender do clima ao qual estão sujeitas, o' +
                'fenômeno do desflorestamento é bastante evidente, pois define uma quebra brusca do padrão dessa variação ao longo do tempo.'
              ),
              bold: false
            }
          ],
          margin: [30, 0, 30, 0],
          alignment: 'center',
          fontSize: 10,
          style: 'body'
        },
        {
          text: '2.2.1 PRODES',
          style: 'listItem'
        },
        {
          text: 'Os projetos PRODES e DETER, utilizados para identificação e',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'quantificação dos desmatamentos, fazem parte do Programa de Monitoramento da Amazônia e Demais Biomas (PAMZ+)' +
            'desenvolvido pela Coordenação-geral de Observação da Terra (CGOBT) e Centro Regional da Amazônia (CRA) do INPE.' +
            'Além do PRODES e DETER, o PAMZ+ conta também com o Sistema de Mapeamento do Uso e Ocupação da Terra (TerraClass).' +
            'Estes três projetos são complementares e concebidos para atender diferentes objetivos.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'O objetivo do PRODES é estimar a taxa anual de desmatamento por',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'corte raso da floresta primária, excluídas as áreas de “não florestas”. Importante ressaltar que' +
            'o termo “desmatamento” é definido como “a supressão de áreas de fisionomia florestal primária por ações' +
            'antropogênicas” (SOUZA et al., 2019)1, ou seja, tratam-se de áreas sem histórico de intervenções pelo Homem' +
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
            'NASA/USGS (EUA), caracterizadas por apresentarem resolução espacial de cerca de 30m e pelo' +
            'menos três bandas espectrais. Atualmente, também são utilizadas imagens dos satélites Sentinel-2' +
            '(União Europeia) ou CBERS-4 (Brasil/China). As imagens desses satélites são disponibilizadas pelos' +
            'seus provedores já ortorretificadas, com correção geométrica de sistema refinada pelo uso de pontos de' +
            'controle e de modelos digitais de elevação do terreno, o que confere um nível mais alto de qualidade das' +
            'informações, em concordância com as normas cartográficas vigentes. A avaliação da acurácia da metodologia do' +
            'PRODES foi feita por Adami et al. (2017)1 para o Estado de Mato Grosso e por Maurano et al. (2019)2 para a Amazônia' +
            'Legal, ambas para o ano 2014, resultando em uma precisão global de 94,5%±2,05 e exatidão global de 93%, respectivamente.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'O detalhamento da metodologia PRODES pode ser consultado em',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'Souza et al. (2019)1. Em suma, a metodologia do PRODES parte dos seguintes pressupostos:'
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
                '“O PRODES só identifica polígonos de desmatamento por corte raso (remoção completa da cobertura florestal primária)' +
                'cuja área for superior a 6,25 haO PRODES só identifica polígonos de desmatamento por corte raso (remoção completa da' +
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
          columns: this.getHeaderDocument()
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
            'gestão ambiental, e já embasaram importantes acordos com setores ligados ao agronegócio, como o' +
            'Termo de Ajustamento de Conduta (TAC) da carne, Moratória da Soja e outros acordos intergovernamentais, como' +
            'o feito na Conferência das Nações Unidas Sobre Mudanças Climáticas (COP21) para a redução das emissões de gases' +
            'de efeito estufa por desflorestamento e degradação florestal1. Ainda, a importância e credibilidade dos dados gerados' +
            'pelo INPE é refletida pelas milhares de publicações científicas que utilizaram essas informações para realização de' +
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
          text: 'O INPE, a partir dos dados do PRODES, identificou desmatamento de',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            this.property.prodesArea + ' hectares no imóvel rural denominado ' + this.property.name + ' (período de 1988 a ' + this.currentYear + '), conforme dinâmica de desmatamento explicitada na Figura 2 e no Anexo 2 (relatório do histórico de imagens de satélite e desmatamentos e queimadas no imóvel rural). O proprietário/posseiro do imóvel rural foi identificado com base nos dados do SIMCAR, INTERMAT ou INCRA.'
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
          image: this.image64mpmt2,
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
              text: 'Dinâmica de desmatamento - 2008/2019',
              bold: false
            }
          ],
          margin: [30, 0, 30, 0],
          alignment: 'center',
          fontSize: 10,
          style: 'body'
        },
        {
          text: 'No Quadro 1 abaixo, consta a quantificação e descrição das áreas',
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
          widths: [ 'auto', 'auto', 'auto', 'auto' ],
          table: {
            headerRows: 1,
            alignment: 'center',
            body: [
              [
                {
                  text: 'Área atingida',
                  style: 'tableHeader'
                },
                {
                  text: 'Desmatamento recente\n(DETER - n° de alertas)',
                  style: 'tableHeader'
                },
                {
                  text: 'Desmatamento pretérito\n(PRODES - ha ano-1)',
                  style: 'tableHeader'
                },
                {
                  text: 'Focos de Queimadas (Num. de focos)',
                  style: 'tableHeader'
                },
                {
                  text: 'Áreas Queimadas (ha ano-1)',
                  style: 'tableHeader'
                }
              ],
              ...this.tableData.map(rel => {
                return [
                        rel.affectedArea,
                        rel.recentDeforestation,
                        rel.pastDeforestation,
                        rel.burnlights,
                        rel.burnAreas
                ];
              })
            ]
          },
          fontSize: 12
        },
        {
          text: 'Anota-se que os dados acima indicados indicam extreme de dúvidas, com grau',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            ' de acurácia com mais de 90% de acerto, no entanto, alterações nos valores poderão ocorrer em decorrência de trabalhos de campo, pelo uso de outras imagens de satélite com diferentes resoluções espaciais, radiométricas e temporais, bem como pela fotointerpretação do analista durante a vetorização das áreas.'
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
              text: 'Na representação cartográfica abaixo ',
              alignment: 'right',
              style: 'body'
            },
            {
              text: '(Figura 3)',
              bold: true,
              style: 'body'
            },
            {
              text: (
                ' é possível visualizar, com imagens de alta resolução (Spot-2,5m e Planet-3m) como estava a cobertura do imóvel em ' + this.prodesStartYear + ' e como se encontra atualmente (' + this.currentYear + '), indicando a ocorrência de desmatamento ilegal no imóvel rural.'
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
              image: this.image64mpmt3,
              fit: [200, 200],
              alignment: 'center'
            },
            {
              image: this.image64mpmt4,
              fit: [200, 200],
              alignment: 'center'
            }
          ]
        },
        {
          text: [
            {
              text: 'Figura 3. ',
              bold: true
            },
            {
              text: 'dinâmica de desmatamento (comparativo imagens ' + this.prodesStartYear + ' e ' + this.currentYear + ')',
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
          text: 'Houve desmatamento ilegal e queimada no imóvel rural objeto deste ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: 'Laudo Técnico, conforme descrito no Quadro 01 (vide item 3. Análise Técnica).',
          margin: [30, 0, 30, 15],
          style: 'body'
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
  }
}
