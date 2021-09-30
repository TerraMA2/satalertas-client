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

	async getReportData() {
		this.inputSat = '';
		this.textAreaComments = '';
		this.docBase64 = null;
		const filter = localStorage.getItem('filterState');
		const date = JSON.parse(localStorage.getItem('dateFilter'));
		this.reportData = await this.reportService.getReportCarData(this.carRegister, date, filter, this.type).then((response: Response) => response.data);

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
