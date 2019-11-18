import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { HTTPService } from 'src/app/services/http.service';

import { ConfigService } from 'src/app/services/config.service';

import { Property } from 'src/app/models/property.model';

import { ScriptService } from 'src/app/services/script.service';

declare let pdfMake: any ;

@Component({
  selector: 'app-final-report',
  templateUrl: './final-report.component.html',
  styleUrls: ['./final-report.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FinalReportComponent implements OnInit {

  private reportConfig;

  property: Property;

  carRegister: string;

  dateFilter: string;

  formattedFilterDate: string;

  currentYear: number;
  prodesStartYear: string;

  tableColumns;

  tableData;

  constructor(
    private activatedRoute: ActivatedRoute,
    private hTTPService: HTTPService,
    private configService: ConfigService,
    private scriptService: ScriptService
  ) {
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => this.carRegister = params.carRegister);
    this.reportConfig = this.configService.getReportConfig();

    this.tableColumns = [
      { field: 'affectedArea', header: 'Área atingida' },
      { field: 'recentDeforestation', header: 'Desmatamento recente (DETER – nº de alertas)' },
      { field: 'pastDeforestation', header: 'Desmatamento pretérito (PRODES – ha ano-1)' }
    ];

    this.tableData = [
      { affectedArea: 'APP', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'ARL', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'AUR', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'UC - PI', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'UC - US', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'TI', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'AUC', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'AUAS', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'AUTEX', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'AD', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'Área autuada', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'Área embargada', recentDeforestation: '', pastDeforestation: '' },
      { affectedArea: 'Área desembargada', recentDeforestation: '', pastDeforestation: '' }
    ];

    this.getReportData();
  }

  getReportData() {
    const date = JSON.parse(localStorage.getItem('dateFilter'));
    const startDate = new Date(date[0]).toLocaleDateString('pt-BR');
    const endDate = new Date(date[1]).toLocaleDateString('pt-BR');

    const filter = localStorage.getItem('filterList');

    this.currentYear = new Date().getFullYear();

    this.formattedFilterDate = `${startDate} - ${endDate}`;

    this.dateFilter = `${date[0]}/${date[1]}`;
    const propertyConfig = this.reportConfig.propertyData;
    const url = propertyConfig.url;
    const viewId = propertyConfig.viewId;
    this.carRegister = this.carRegister.replace('\\', '/');
    const carRegister = this.carRegister;
    this.hTTPService.get(url, {viewId, carRegister, date, filter}).subscribe((reportData: Property) => {
      this.prodesStartYear = reportData.prodesYear[0]['date'];

      const bboxArray = reportData.bbox.split(',');
      const bbox = bboxArray[0].split(' ').join(',') + ',' + bboxArray[1].split(' ').join(',');

      reportData.bbox = bbox;
      this.property = reportData;
    });
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
    sessionStorage.setItem('relatorio', JSON.stringify(this.property));
    return {
      content: [
        {
          text: 'NOTÍCIA DE FATO SIMP:',
          bold: true,
          fontSize: 12,
          alignment: 'left',
          margin: [30, 40, 0, 5]
        },
        {
          text: `MUNICÍPIO: ${this.property.city}-MT`,
          bold: true,
          fontSize: 12,
          alignment: 'left',
          margin: [30, 40, 0, 5]
        },
        {
          text: `COMARCA: ${this.property.county}`,
          bold: true,
          fontSize: 12,
          alignment: 'left',
          margin: [30, 40, 0, 5]
        },
        {
          text: `NOME DO PROJETO – TCT 30/2018 MP/INPE`,
          bold: true,
          fontSize: 12,
          color: 'green',
          alignment: 'center',
          margin: [30, 40, 0, 5]
        },
        {
          text: `RELATÓRIO Nº 00000/2019`,
          bold: true,
          fontSize: 12,
          alignment: 'center',
          margin: [30, 40, 0, 5]
        },
        {
          text: `1 OBJETIVO`,
          bold: true,
          fontSize: 12,
          alignment: 'left',
          margin: [30, 40, 0, 5]
        },
        {
          text: `Trata-se de relatório sobre desmatamento ilegal identificado com o uso de Sistema de Informações Geográficas no imóvel rural FAZENDA XXXXX (mapa de localização e do perímetro do imóvel – figura 1), localizado no município de XXXXX-MT, pertencente a XXXXXXXX, conforme informações declaradas no Sistema Mato-grossense de Cadastro Ambiental Rural (SIMCAR), protocolo CAR MT66666/2018 (Anexo I).`,
          fontSize: 12,
          alignment: 'left',
          margin: [30, 40, 0, 5]
        },
        // {
        //   image: `http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=terrama2_5:view5&styles=&bbox=${this.property.bbox}&width=404&height=431&time=${this.dateFilter}&cql_filter=numero_do1='${this.property.register}'&srs=EPSG:4674&format=image/png`,
        //   width: 450,
        //   alignment: 'center'
        // },
        {
          widths: [ 40, 'auto', 100, 40 ],
          alignment: 'center',
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
                  text: 'Desmatamento recente (DETER - n° de alertas)',
                  style: 'tableHeader'
                },
                {
                  text: 'Desmatamento pretérito (PRODES - ha ano-1)',
                  style: 'tableHeader'
                }
              ],
              ...this.tableData.map(rel => {
                return [rel.affectedArea, rel.recentDeforestation, rel.pastDeforestation];
              })
            ]
          },
          fontSize : 12
        }
      ],
      styles: {
        tableStyle: {
          alignment: 'center',
          margin: [0, 0, 0, 5]
        },
        tableHeader: {
          fontSize: 11,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 5]
        }
      }
    };
  }

  // getPic() {
  //   if (this.property.images[0]) {
  //     return this.property.images[0];
  //   } else {
  //     return null;
  //   }
  // }

  // fileChanged(e) {
  //   const file = e.target.files[0];
  //   console.log(file);
  //   this.getBase64(file);
  // }

  // getBase64(file) {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => {
  //     console.log(reader.result);
  //     this.property.images[0] = reader.result as string;
  //   };
  //   reader.onerror = (error) => {
  //     console.log('Error: ', error);
  //   };
  // }

}
