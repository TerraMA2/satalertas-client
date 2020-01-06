import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { HTTPService } from 'src/app/services/http.service';

import { ConfigService } from 'src/app/services/config.service';

import { SidebarService } from 'src/app/services/sidebar.service';

import { Property } from 'src/app/models/property.model';

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

  private pages;
  private media;

  property;

  carRegister: string;

  dateFilter: string;

  formattedFilterDate: string;

  currentYear: number;
  prodesStartYear: string;

  tableColumns;

  tableData;

  bbox: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private hTTPService: HTTPService,
    private configService: ConfigService,
    private sidebarService: SidebarService
  ) {}

  async ngOnInit() {
    this.pages = 10;
    this.media = 3;

    this.activatedRoute.params.subscribe(params => this.carRegister = params.carRegister);
    this.reportConfig = this.configService.getReportConfig();

    this.sidebarService.sidebarLayerShowHide.next(false);

    this.tableColumns = [
      { field: 'affectedArea', header: 'Área atingida' },
      { field: 'recentDeforestation', header: 'Desmatamento recente (DETER – ha ano-1)' },
      { field: 'pastDeforestation', header: 'Desmatamento pretérito (PRODES – ha ano-1)' },
      { field: 'burnlights', header: 'Focos de Queimadas (Num.de focos)' },
      { field: 'burnAreas', header: 'Áreas Queimadas (ha ano-1)' }
    ];

    await this.getReportData();

    // this.image64mpmt1
    // this.image64mpmt2
    // this.image64mpmt3
    // this.image64mpmt4
    // this.imageHeader

    // const documentDefinition = this.getDocumentDefinition();
    // await pdfMake.createPdf(documentDefinition).getBase64(base64Document => {
    //   this.hTTPService.post('http://localhost:3200/report/add', {base64Document})
    //                 .toPromise().then(response => {
    //     console.log(response);
    //   });
    // });
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
      const exploration = reportData['exploration'];
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

      this.hTTPService.getBlob(`http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_5:view5,terrama2_5:view5,terrama2_20:view20&styles=&bbox=-61.6904258728027,-18.0950622558594,-50.1677627563477,-7.29556512832642&width=250&height=250&cql_filter=id_munic>0;municipio='${this.property.city}';numero_do1='${this.property.register}'&srs=EPSG:4326&format=image/png`)
                    .subscribe((response) => {
                      return new Promise((resolve, reject) => {
                        const fileReader  = new FileReader();
                        fileReader.addEventListener('load', () => resolve(fileReader.result), false);
                        fileReader.onerror = () => reject(this);
                        const fileBase64 = fileReader.readAsDataURL(response);
                        this.image64mpmt = fileBase64;
                      });
                    }
      );
      this.hTTPService.getBlob(`http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_20:view20&styles=&bbox=${this.property.bbox}&width=400&height=400&time=${this.prodesStartYear}/P1Y&cql_filter=numero_do1='${this.property.register}'&srs=EPSG:4326&format=image/png`)
                    .subscribe((response) => {
                      return new Promise((resolve, reject) => {
                        const fileReader  = new FileReader();
                        fileReader.addEventListener('load', () => resolve(fileReader.result), false);
                        fileReader.onerror = () => reject(this);
                        const fileBase64 = fileReader.readAsDataURL(response);
                        this.image64mpmt1 = fileBase64;
                      });
                    }
      );
      this.hTTPService.getBlob(`http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_20:view20,terrama2_73:view73&styles=&bbox=${this.property.bbox}&width=404&height=431&time=${this.property.prodesYear}/${this.currentYear}&cql_filter=numero_do1='${this.property.register}';de_car_validado_sema_numero_do1='${this.property.register}'&srs=EPSG:4674&format=image/png`)
                    .subscribe((response) => {
                      return new Promise((resolve, reject) => {
                        const fileReader  = new FileReader();
                        fileReader.addEventListener('load', () => resolve(fileReader.result), false);
                        fileReader.onerror = () => reject(this);
                        const fileBase64 = fileReader.readAsDataURL(response);
                        this.image64mpmt2 = fileBase64;
                      });
                    }
      );
      this.hTTPService.getBlob(`http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_20:view20,terrama2_73:view73&styles=&bbox=${this.property.bbox}&width=400&height=400&time=${this.property.prodesYear}/P1Y&cql_filter=numero_do1='${this.property.register}';de_car_validado_sema_numero_do1='${this.property.register}'&srs=EPSG:4674&format=image/png`)
                    .subscribe((response) => {
                      return new Promise((resolve, reject) => {
                        const fileReader  = new FileReader();
                        fileReader.addEventListener('load', () => resolve(fileReader.result), false);
                        fileReader.onerror = () => reject(this);
                        const fileBase64 = fileReader.readAsDataURL(response);
                        this.image64mpmt3 = fileBase64;
                      });
                    }
      );
      this.hTTPService.getBlob(`http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_20:view20,terrama2_73:view73&styles=&bbox=${this.property.bbox}&width=400&height=400&time=2019/P1Y&cql_filter=numero_do1='${this.property.register}';de_car_validado_sema_numero_do1='${this.property.register}'&srs=EPSG:4674&format=image/png`)
                    .subscribe((response) => {
                      return new Promise((resolve, reject) => {
                        const fileReader  = new FileReader();
                        fileReader.addEventListener('load', () => resolve(fileReader.result), false);
                        fileReader.onerror = () => reject(this);
                        const fileBase64 = fileReader.readAsDataURL(response);
                        this.image64mpmt4 = fileBase64;
                      });
                    }
      );
      this.imageHeader = this.getBaseImage('assets/img/logos/logo-mpmt2.png');

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
            text: 'Centros de Apoio Operacional\n',
            bold: false
          },
          {
            text: 'Centro de Apoio à Execução Ambiental',
            bold: false
          }
        ],
        fontSize: 9,
        alignment: 'left',
        margin: [30, 30, 0, 5]
      }
    ];
  }

  generatePdf(action = 'open') {
    const documentDefinition = this.getDocumentDefinition();
    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;
      default: pdfMake.createPdf(documentDefinition).open(); break;
    }
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
          text: 'NOME DO PROJETO – TCT 30/2018 MP/INPE',
          color: 'green',
          style: 'title'
        },
        {
          text: 'RELATÓRIO Nº 00000/2019',
          style: 'title',
          margin: [30, 0, 30, 20]
        },
        {
          text: '1 OBJETIVO',
          style: 'listItem'
        },
        {
          text: 'Trata-se de relatório sobre desmatamento ilegal identificado com o uso de Sistema de',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'Informações Geográficas no imóvel rural FAZENDA XXXXX (mapa de ' +
            'localização e do perímetro do imóvel – figura 1), localizado no município de XXXXX-MT ' +
            'pertencente a XXXXXXXX, conforme informações declaradas no Sistema Mato-grossense de ' +
            'Cadastro Ambiental Rural (SIMCAR), protocolo CAR MT66666/2018 (Anexo I).'
          ),
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          columns: [
            {
              image: this.image64mpmt,
              margin: [0, 0, 0, 10],
              alignment: 'center',
              width: 200,
              height: 200
            },
            {
              image: this.image64mpmt1,
              margin: [0, 0, 0, 10],
              alignment: 'center',
              width: 200,
              height: 200
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
          text: 'As informações sobre desmatamentos foram geradas no âmbito do Termo de',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'Cooperação Técnica n. 30/2018 firmado entre Ministério Público do Estado de Mato ' +
            'Grosso e Instituto Nacional de Pesquisas Espaciais (INPE) cujo objeto consiste na coleta ' +
            'automática, armazenamento e tratamento de dados geoespaciais para interseções entre produtos do ' +
            'PRODES, DETER e Queimadas do INPE com os dados de fontes estatais oficiais.'
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
          text: '2.1 Materiais e equipamentos utilizados',
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
                'Dados das áreas desmatadas no Estado de Mato Grosso mapeadas pelos projetos:' +
                'Programa de Monitoramento da Floresta Amazônica' +
                'Brasileira por Satélite (PRODES), Sistema de Detecção de Desmatamento' +
                'em Tempo Real (DETER) e Programa Queimadas,' +
                'ambos desenvolvidos pelo Instituto Nacional de Pesquisas Espaciais (INPE);'
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
                'Informações e dados geográficos do SIMCAR Parceiros e Público, da Secretaria de Meio Ambiente' +
                'do Estado de Mato Grosso (SEMA):  i. proprietário(s)/posseiro(s);' +
                'ii. Base de referência do CAR validado; ' +
                'iii. Base de referência do CAR em análise; ' +
                'iv. Base de referência do CAR aguardando complementação;' +
                'v. Base de referência do CAR cancelado e indeferido; e ' +
                'vi. Base de referência do' +
                'Programa de Regularização Ambiental (PRA);'
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
                'v. Base de referência das Áreas de Preservação Permanente (APP), Reserva Legal (ARL), Uso Restrito (AUS) e Áreas de Uso Consolidado (AUC);'
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
              text: 'Dados dos imóveis rurais cadastrados no Instituto de Terras de Mato Grosso (INTERMAT);',
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
              text: 'Dados do acervo fundiário do Instituto Nacional de Colonização e Reforma Agrária (INCRA);',
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
              text: 'Dados geográficos das autuações e áreas embargadas pelo Instituto Nacional de Meio Ambiente e Recursos Naturais Renováveis (IBAMA);',
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
                'Dados geográficos das Unidades de Conservação (UC) no Estado de Mato Grosso, ' +
                'disponíveis no Cadastro Nacional de Unidades de Conservação do Ministério de Meio Ambiente (MMA);'
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
              text: 'Dados geográficos das Terras Indígenas no Estado de Mato Grosso, disponíveis no sítio eletrônico da Fundação Nacional do Índio (FUNAI);',
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
              text: 'Mapa de vegetação do Projeto RadamBrasil;',
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
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
              text: 'Plataforma de monitoramento, análise e alerta a extremos ambientais TerraMA2, desenvolvida pelo INPE;',
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'k) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: 'Dados disponíveis no INFOSEG;',
              margin: [20, 0, 30, 5],
              width: 'auto',
              style: 'body'
            }
          ]
        },
        {
          columns: [
            {
              text: 'l) ',
              margin: [50, 0, 0, 5],
              width: 'auto',
              style: 'body'
            },
            {
              text: 'Imagens dos Satélite Landsat, SPOT, Plantet, Sentinel-2, CBERS-4 e outras imagens que possam ser acrescidas.',
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
          text: 'Os dados de desmatamentos (polígonos) dos projetos DETER e',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'PRODES, além dos dados do Programa de Queimadas na forma de focos (pontos) e áreas queimadas (INPE) ' +
            'foram cruzados com informações geoespaciais de fontes oficiais para identificação, qualificação e ' +
            'quantificação dos danos ambientais causados por desmatamentos ilegais (recentes, via DETER, e passados, via PRODES), ' +
            'bem como para identificação dos responsáveis pelo imóvel rural atingido, para fins de responsabilização civil e, eventualmente, criminal.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Os dados geoespaciais do SIMGEO, MMA e FUNAI foram cruzados',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'com os dados do INPE para identificação e quantificação dos desmatamentos após 22.07.2008 em áreas ' +
            'protegidas (APP, ARL, AUR, UC e TI), bem como para identificar ilícitos ambientais, mediante o cruzamento com dados das Autorizações ' +
            'de Exploração (AUTEX) e de Desmatamento (AD) emitidas pela SEMA. Ainda, verificou-se se as áreas desmatadas já haviam sido autuadas ' +
            'ou embargadas pelos órgãos de controle ambiental (SEMA e IBAMA). Para qualificação da área desmatada, o tipo de vegetação desmatada ' +
            'foi identificada utilizando o mapa de vegetação do Projeto RadamBrasil.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'As informações sobre o imóvel rural onde incidiu o desmatamento e sua',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: 'titularidade foram coletadas na base de dados do SIMCAR, INTERMAT, INCRA e INFOSEG.',
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Os projetos PRODES e DETER, utilizados para identificação, ',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'quantificação e qualificação dos desmatamentos, fazem parte do Programa de Monitoramento da Amazônia e Demais ' +
            'Biomas (PAMZ+) desenvolvido pela Coordenação-geral de Observação da Terra (CGOBT) e Centro Regional da Amazônia (CRA) ' +
            'do INPE. Além do PRODES e DETER, o PAMZ+ conta também com Sistema de Mapeamento do Uso e Ocupação da Terra (TerraClass). ' +
            'Estes três projetos são complementares e concebidos para atender diferentes objetivos.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'O objetivo do DETER é identificar diariamente alterações na cobertura',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'natural dentro dos biomas Amazônia e Cerrado, em áreas acima de 3 ha com a emissão de alertas para apoio à fiscalização. ' +
            'Os alertas indicam áreas que sofreram corte raso ou intervenções pela exploração madeireira, mineração, queimadas ou seja, ' +
            'identificam e mapeiam áreas desflorestadas e degradadas em fisionomias florestais no bioma  Amazônia. Para o bioma Cerrado são ' +
            'identificadas apenas a supressão da vegetação natural.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'O DETER é operado com imagens do sensor WFI do satélite',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'CBERS-4 do INPE/CRESDA (Brasil/China), com resolução espacial de 64m e 4 bandas espectrais (azul, verde, vermelho e infravermelho próximo).. ' +
            'Para isso, as frações de solo, vegetação e sombra em uma imagem são estimadas a partir do Modelo Linear de Mistura Espectral (MLME), a fim ' +
            'de realçar feições de extração seletiva de madeira e de queimadas, que fazem parte do processo de desmatamento.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Assim, no âmbito do DETER, diariamente são escolhidas imagens com',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'menor cobertura de nuvens e feita a composição das bandas espectrais mais sensíveis às respostas da contribuição do ' +
            'solo e da vegetação para realçar áreas de desmatamento, que são identificadas por fotointerpretação considerando a tonalidade, ' +
            'textura e contexto da área na imagem de satélite processada. Com essa metodologia, o sistema é capaz de diferenciar impactos naturais ' +
            'de antrópicos, em razão das feições das áreas analisadas. O tempo entre o mapeamento dos alertas, validação e inclusão no banco de ' +
            'dados é de aproximadamente 72 horas.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Diferentemente do DETER, o objetivo do PRODES é estimar a taxa',
          alignment: 'right',
          margin: [30, 0, 30, 0],
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
          text: (
            'anual de desmatamento por corte raso da floresta primária no bioma Amazônia, , excluídas as “não florestas”, ' +
            'da mesma forma que o DETER. Importante ressaltar, que o termo “desmatamento” é definido como a “supressão de áreas ' +
            'de fisionomia florestal primária por ações antropogênicas”, ou seja, tratam-se de áreas sem histórico de intervenções ' +
            'pelo Homem no passado (INPE, 2019). No bioma Cerrado, da mesma forma que o DETER, o PRODES mapeia a ' +
            'supressão de vegetação natural do cerrado.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'O PRODES utiliza imagens de satélite compatíveis com as geradas pela',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'série Landsat da NASA/USGS (EUA), caracterizadas por apresentarem resolução espacial de cerca de 30m e ' +
            'pelo menos três bandas espectrais. Atualmente, também podem ser utilizadas imagens dos satélites Landsat-8, ' +
            'Sentinel-2 (União Europeia) ou CBERS-4. As imagens desses satélites são disponibilizadas pelos seus provedores ' +
            'já ortorretificadas, com correção geométrica de sistema refinada pelo uso de pontos de controle e de modelos ' +
            'digitais de elevação do terreno, o que confere um nível mais alto da qualidade das informações, em concordância ' +
            'com as normas cartográficas vigentes. A avaliação da acurácia da metodologia do PRODES foi feita por Adami et al. ' +
            '(2017) para o ano 2014 no Estado de Mato Grosso, resultando em uma precisão global de 94,5% ± 2,05.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Os dados do INPE constituem fonte de acentuada importância para a',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'gestão ambiental, sendo que, inclusive, embasaram importantes acordos com setores ligados ao agronegócio, ' +
            'como o TAC da carne, Moratória da Soja e outros acordos intergovernamentais como na Conferência das Nações ' +
            'Unidas Sobre Mudanças Climáticas (COP21), como lembrado por ADAMI et al (op.cit.). Tamanha a importância e ' +
            'credibilidade dos monitoramentos realizados pelo INPE é testemunhada por terem embasado mais de 7.000 ' +
            'publicações científicas (Google Scholar)'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: 'Em resumo, a metodologia do PRODES parte dos pressupostos abaixo,',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: 'cujo detalhamento pode ser consultado em Souza et al. (2019).',
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
                'cuja área for superior a 6,25 ha.'
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
                'Em casos de alta cobertura de nuvem, imagens de múltiplos satélites (ou datas) podem ser ' +
                'usadas para compor uma localização.'
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
          text: '',
          pageBreak: 'after'
        },
        {
          columns: this.getHeaderDocument()
        },
        {
          text: 'Todas as informações acima descritas foram integradas utilizando',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'a plataforma computacional TerraMA2. Essa plataforma foi desenvolvida pelo INPE para o monitoramento, ' +
            'análise e emissão de alertas sobre extremos ambientais. Assim, utilizando esta base tecnológica inovadora, ' +
            'no domínio de softwares abertos, as tarefas executadas pela plataforma foram definidas para coletar, analisar ' +
            '(intersecção de geometrias dos mapas), visualizar e consultar dados sobre danos ambientais causados por ' +
            'desmatamentos e queimadas. Para isso, dados dinâmicos e estáticos foram processados para produzirem as ' +
            'informações que foram sistematizadas neste relatório.'
          ),
          margin: [30, 0, 30, 5],
          style: 'body'
        },
        {
          text: '3 ANÁLISE TÉCNICA',
          style: 'listItem'
        },
        {
          text: 'O Instituto Nacional de Pesquisas Espaciais, a partir dos dados',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'geoespaciais, identificou desmatamento de XX hectares na Fazenda XXXXX após 22.07.2008 ' +
            '(período do filtro), conforme dinâmica de desmatamento explicitada em ' +
            'representação cartográfica que segue (figura 2):'
          ),
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          image: this.image64mpmt2,
          alignment: 'center',
          margin: [0, 0, 0, 10],
          width: 200,
          height: 200
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
          alignment: 'center',
          fontSize: 10
        },
        {
          text: '',
          pageBreak: 'after'
        },
        {
          columns: this.getHeaderDocument()
        },
        {
          text: 'No quadro demonstrativo abaixo consta a quantificação qualitativa das',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          image: `http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_20:view20&styles=&bbox=${this.property.bbox}&width=404&height=431&time=${this.dateFilter}&cql_filter=numero_do1='${this.property.register}'&srs=EPSG:4674&format=image/png`,
          width: 450,
          alignment: 'center'
        },
        {
          text: (
            'áreas desmatadas que foram identificadas com o ' +
            'cruzamento dos dados descritos no histórico desse relatório (quadro 1):'
          ),
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          text: [
            {
              text: 'Quadro 1 ',
              bold: true
            },
            {
              text: '- Classes e quantitativos de áreas desmatadas na Fazenda XXXXX.',
              bold: false
            }
          ],
          alignment: 'center',
          fontSize: 8
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
                  text: 'Focos de Queimadas (Num.de focos)',
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
          text: 'Anota-se que os dados acima indicados indicam extreme de dúvidas,',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'com grau de acurácia de aproximadamente 95% de acerto, o quantitativo dos desmatamentos, ' +
            'sendo que alterações mínimas poderão ocorrer em decorrência de trabalhos de campo ou uso ' +
            'de outras imagens de satélite com outras escalas ou resolução'
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
          text: 'Na representação cartográfica abaixo é possível visualizar, com',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: (
            'imagens de alta resolução [Spot (2,5 m) e Planet (3 m)] como estava ' +
            'a cobertura do imóvel em 2008 e como se encontra atualmente (2019):'
          ),
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          columns: [
            {
              image: this.image64mpmt3,
              margin: [0, 0, 0, 10],
              alignment: 'center',
              width: 200,
              height: 200
            },
            {
              image: this.image64mpmt4,
              margin: [0, 0, 0, 10],
              alignment: 'center',
              width: 200,
              height: 200
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
              text: 'dinâmica de desmatamento (comparativo imagens 2008 e 2019)',
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
          text: 'Houve desmatamento no imóvel rural objeto deste Relatório Técnico conforme',
          alignment: 'right',
          margin: [30, 0, 30, 0],
          style: 'body'
        },
        {
          text: 'quadro 01 (vide item 3).',
          margin: [30, 0, 30, 15],
          style: 'body'
        },
        {
          text: ('Este é o relatório contendo ' + this.pages.toString() + ' páginas e ' + this.media.toString() + ' anexos'),
          margin: [30, 0, 30, 15],
          style: 'body'
        },
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
          fontSize: 11,
          alignment: 'left',
          margin: [30, 0, 30, 2]
        },
        body: {
          fontSize: 11,
          alignment: 'justify'
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
