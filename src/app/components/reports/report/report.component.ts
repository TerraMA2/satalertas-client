import { Component, Inject, LOCALE_ID, OnInit, ViewEncapsulation } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { SidebarService } from 'src/app/services/sidebar.service';

import { ReportService } from '../../../services/report.service';

import { Response } from 'src/app/models/response.model';

import { ExportService } from '../../../services/export.service';

import { AuthService } from 'src/app/services/auth.service';

import { ConfirmationService } from 'primeng/api';

import { ReportImage } from '../../../models/report-image.model';

import { formatNumber } from '@angular/common';

import { User } from '../../../models/user.model';

import { NavigationService } from '../../../services/navigation.service';

@Component({
	selector: 'app-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.css'],
	encapsulation: ViewEncapsulation.None,
	providers: [ConfirmationService]
})

export class ReportComponent implements OnInit {
	reportData;
	carRegister: string;
	type: string;
	docBase64;
	generatingReport = false;
	inputSat: string;
	textAreaComments: string;
	loggedUser: User = null;
	downloadVectors = false;
	formatValueLocate = {
		async prodes(reportData) {
			const property = reportData.property;
			if (!property) {
				return;
			}
			property.area = formatNumber(reportData.property.area, 'pt-BR', '1.0-4');
			property.area_km = formatNumber(reportData.property.area_km, 'pt-BR', '1.0-4');
			property.areaPastDeforestation = formatNumber(reportData.property.areaPastDeforestation, 'pt-BR', '1.0-4');
			property.lat = formatNumber(reportData.property.lat, 'pt-BR', '1.0-4');
			property.long = formatNumber(reportData.property.long, 'pt-BR', '1.0-4');

			property.prodesTotalArea = formatNumber(reportData.property.prodesTotalArea, 'pt-BR', '1.0-4');
			property.areaUsoCon = formatNumber(reportData.property.areaUsoCon, 'pt-BR', '1.0-4');
			property.prodesArea = formatNumber(reportData.property.prodesArea, 'pt-BR', '1.0-4');

			if (!property.tableVegRadam) {
				return;
			}
			if (property.tableVegRadam.pastDeforestation) {
				const listPastDeforestation = property.tableVegRadam.pastDeforestation.split('\n');
				let pastDeforestationStr = '';
				for (const data of listPastDeforestation) {
					const pastDeforestation = data.substring(0, data.indexOf(':'));
					const valuePastDeforestation = formatNumber(data.substring(data.indexOf(':') + 1, data.length), 'pt-BR', '1.0-4');

					pastDeforestationStr = pastDeforestationStr ? `${ pastDeforestationStr }\n${ pastDeforestation }: ${ valuePastDeforestation }` : `${ pastDeforestation }: ${ valuePastDeforestation }`;
				}
				property.tableVegRadam.pastDeforestation = pastDeforestationStr;
			} else {
				property.tableVegRadam.pastDeforestation = '0';
			}

			for (const data of reportData.prodesTableData) {
				data.area = formatNumber(data.area, 'pt-BR', '1.0-4');
			}
			for (const data of property.vegRadam) {
				data.area_ha_ = formatNumber(data.area_ha_, 'pt-BR', '1.0-4');
				data.area_ha_car_vegradam = formatNumber(data.area_ha_car_vegradam, 'pt-BR', '1.0-4');
			}
			if (property.prodesRadam) {
				for (const data of property.prodesRadam) {
					data.area = formatNumber(data.area, 'pt-BR', '1.0-4');
				}
			}
			for (const data of property.deforestationHistory) {
				data.area = formatNumber(data.area, 'pt-BR', '1.0-4');
			}
			for (const data of property.tableData) {
				data.pastDeforestation = formatNumber(data.pastDeforestation, 'pt-BR', '1.0-4');
			}
			for (const data of property.analyzesYear) {
				data.area = formatNumber(data.area, 'pt-BR', '1.0-4');
			}
		},
		async deter(reportData) {
			const property = reportData.property;
			if (!property) {
				return;
			}
			property.area = formatNumber(property.area, 'pt-BR', '1.0-4');
			property.area_km = formatNumber(property.area_km, 'pt-BR', '1.0-4');
			property.areaPastDeforestation = formatNumber(property.areaPastDeforestation ? property.areaPastDeforestation : 0, 'pt-BR', '1.0-4');
			property.lat = formatNumber(property.lat, 'pt-BR', '1.0-4');
			property.long = formatNumber(property.long, 'pt-BR', '1.0-4');

			if (property.tableData) {
				for (const data of property.tableData) {
					data.pastDeforestation = formatNumber(data.pastDeforestation, 'pt-BR', '1.0-4');
				}
			}
		},
		async queimada(reportData) {
		}
	};

	constructor(
		private activatedRoute: ActivatedRoute,
		private sidebarService: SidebarService,
		private reportService: ReportService,
		private authService: AuthService,
		private router: Router,
		private confirmationService: ConfirmationService,
		private exportService: ExportService,
		private navigationService: NavigationService,
		@Inject(LOCALE_ID) private locale: string
	) {
	}

	async ngOnInit() {
		this.activatedRoute.data.subscribe(data => this.loggedUser = data['user']);

		this.activatedRoute.params.subscribe(params => {
			this.carRegister = params.carRegister;
			this.type = params.type;
		});

		this.reportService.changeReportType.subscribe((params) => {
			const type = params['type'];
			const carRegister = params['carRegister'];
			this.carRegister = carRegister;
			this.type = type;
			this.navigationService.changeUrl(`/reports/${type}/${carRegister}`)
			this.getReportData();
		});
		await this.getReportData();
	}

	async getContextDeflorestationAlerts(deforestationAlerts) {
		const deforestationAlertsContext = [];
		const deforestationAlertsCount = deforestationAlerts.length;

		if (deforestationAlerts && deforestationAlertsCount > 0) {
			let images = [];
			let titleDate = [];
			let subTitleArea = [];
			let startingYear = new Date().getFullYear();

			for (let i = 0; i < deforestationAlertsCount; ++i) {
				images.push(this.getImageObject(deforestationAlerts[i].urlGsImageBefore, [225, 225], [0, 0, 0, 0], 'left'));
				images.push(this.getImageObject(deforestationAlerts[i].urlGsImageCurrent, [225, 225], [13, 0, 0, 0], 'right'));

				startingYear = (deforestationAlerts[i].year - 1) < startingYear ? (deforestationAlerts[i].year - 1) : startingYear;

				titleDate.push({
					text: `Alerta(${ deforestationAlerts[i].date }) - Imagem(${ deforestationAlerts[i].year - 1 })`,
					fontSize: 8,
					style: 'body',
					alignment: 'center'
				});

				titleDate.push({
					text: `Alerta(${ deforestationAlerts[i].date }) - Imagem(${ deforestationAlerts[i].date })`,
					fontSize: 8,
					style: 'body',
					alignment: 'center'
				});

				subTitleArea.push({
					text: `${ formatNumber(deforestationAlerts[i].area, 'pt-BR', '1.0-4') } ha`,
					fontSize: 8,
					style: 'body',
					alignment: 'center'
				});

				if (i === 0) {
					deforestationAlertsContext.push(
						{
							text: `Na  figura 3, a seguir, será  representado  o detalhamento  dos  alertas.`,
							alignment: 'right',
							margin: [30, 0, 30, 0],
							style: 'body'
						}
					);
				} else {
					deforestationAlertsContext.push(
						{
							text: '',
							pageBreak: 'after'
						}
					);
				}
				deforestationAlertsContext.push(
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
							this.getImageObject(deforestationAlerts[i].urlGsImagePlanetCurrentAndCar, [420, 420], [0, 0], 'center')
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

			deforestationAlertsContext.push({
				text: [
					{
						text: 'Figura 3. ',
						bold: true
					},
					{
						text: ` Comparativo de imagens de satélite anterior à ${ startingYear } e atual ${ new Date().getFullYear() }.`,
						bold: false
					}
				],
				margin: [30, 0, 30, 0],
				alignment: 'center',
				fontSize: 9
			});
		}
		return deforestationAlertsContext;
	}

	async getContextDeforestationHistory(deforestationHistory, urlGsDeforestationHistory, urlGsDeforestationHistory1) {
		const deforestationHistoryContext = [];
		const deforestationHistoryCount = deforestationHistory.length;

		if (deforestationHistory && deforestationHistoryCount > 0) {
			const deforestationData = [];
			const deforestationColumns = [];

			deforestationHistoryContext.push({
				text: '',
				pageBreak: 'after'
			});
			deforestationHistoryContext.push({
				columns: [{
					text: `O histórico do desmatamento desde ${ deforestationHistory[0].date } pode ser visto na figura 7.`,
					margin: [30, 0, 30, 15],
					style: 'bodyIndentFirst'
				}]
			});
			let count = 1;
			for (let i = 0; i < deforestationHistoryCount; ++i) {
				count += 1;
				const view = deforestationHistory[i].date < 2013 ? 'LANDSAT_5_' :
					deforestationHistory[i].date < 2017 ? 'LANDSAT_8_' :
						'SENTINEL_2_';

				let url = deforestationHistory[i].date === 2012 ? urlGsDeforestationHistory1 : urlGsDeforestationHistory.replace(new RegExp('#{image}#', ''), `${ view }${ deforestationHistory[i].date }`);
				url = url.replace(new RegExp('#{year}#', ''), deforestationHistory[i].date);

				deforestationData.push(
					[
						{
							text: `${ deforestationHistory[i].date }`,
							style: 'body',
							alignment: 'center'
						},
						this.getImageObject(await this.getBaseImageUrl(url), [117, 117], [5, 0], 'center'),
						{
							text: `${ deforestationHistory[i].area } ha`,
							style: 'body',
							alignment: 'center'
						}
					]
				);
			}

			for (let start = 0; start < deforestationData.length; start += 3) {
				if (start !== 0 && ((start) % 12) === 0) {
					deforestationColumns.push({
						text: '',
						pageBreak: 'after'
					});
				}
				if ((start + 3) < deforestationData.length) {
					deforestationColumns.push({
						margin: [30, 0, 30, 0],
						alignment: 'center',
						columns: [
							...deforestationData.slice(start, start + 3)
						]
					});
				} else {
					deforestationColumns.push({
						margin: [30, 0, 30, 0],
						alignment: 'center',
						columns: [
							...deforestationData.slice(start),
						]
					});
				}
			}

			deforestationHistoryContext.push(
				...deforestationColumns,
				{
					text: [
						{
							text: 'Figura 7. ',
							bold: true
						},
						{
							text: ` Histórico de desmatamento do PRODES desde ${ deforestationHistory[0].date }.`,
							bold: false
						}
					],
					margin: [30, 0, 30, 0],
					alignment: 'center',
					fontSize: 9
				});
		}

		return deforestationHistoryContext;
	}

	async getReportData() {
		this.inputSat = '';
		this.textAreaComments = '';
		this.docBase64 = null;
		const filter = localStorage.getItem('filterState');
		const date = JSON.parse(localStorage.getItem('dateFilter'));
		this.reportData = await this.reportService.getReportCarData(this.carRegister, date, filter, this.type).then((response: Response) => response.data);
		await this.formatValueLocate[this.type](this.reportData);
		if (this.reportData['type'] === 'prodes') {
			this.reportData['deforestationHistoryContext'] = await this.getContextDeforestationHistory(this.reportData.property['deforestationHistory'], this.reportData.urlGsDeforestationHistory, this.reportData.urlGsDeforestationHistory1);
		}
		if (this.reportData['type'] === 'deter') {
			this.reportData['deforestationAlertsContext'] = await this.getContextDeflorestationAlerts(this.reportData.property.deforestationAlerts);
		}
		this.docBase64 = await this.reportService.createPdf(this.reportData).then((response: Response) => response.data);
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
		return await this.getBase64ImageFromUrl(url).then(result => [result]).catch(err => console.error(err));
	}

	async generatePdf(action = 'open') {
		const linkTag = document.createElement('a');
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
					const report = response.data;
					const document = report.document;
					const reportName = report.name;

					this.reportService.downloadPdf(this.reportData, document, reportName, linkTag, this.downloadVectors);

					this.generatingReport = false;
				});
			},
			reject: () => {
				this.generatingReport = false;
			}
		});
	}

	onViewReportClicked(reportType) {
		const carRegister = this.carRegister;
		if (reportType) {
			this.reportService.changeReportType.next({
				type: reportType,
				carRegister
			});
		} else {
			this.router.navigateByUrl(`/synthesis/${ carRegister }`);
		}
	}

	getImageObject(image, fit, margin, alignment) {
		if (image && image[0] && !image[0].includes('data:application/vnd.ogc.se_xml') && !image[0].includes('data:text/xml;')) {
			return new ReportImage(
				image,
				fit,
				margin,
				alignment
			);
		} else {
			return {
				text: 'Imagem não encontrada.',
				alignment: 'center',
				color: '#591111',
				fontSize: 9,
				italics: true,
				margin: [30, 60, 30, 60]
			};
		}
	}

	back() {
		this.navigationService.back();
	}
}
