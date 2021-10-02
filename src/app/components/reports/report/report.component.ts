import { Component, Inject, LOCALE_ID, OnInit, ViewEncapsulation } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { SidebarService } from 'src/app/services/sidebar.service';

import { ReportService } from '../../../services/report.service';

import { Response } from 'src/app/models/response.model';

import { ExportService } from '../../../services/export.service';

import { AuthService } from 'src/app/services/auth.service';

import { ConfirmationService } from 'primeng/api';

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
	carGid: string;
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
			this.carGid = params.carGid;
			this.type = params.type;
		});

		this.reportService.changeReportType.subscribe((params) => {
			const type = params['type'];
			const carGid = params['carGid'];
			this.carGid = carGid;
			this.type = type;
			this.navigationService.changeUrl(`/reports/${type}/${carGid}`)
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
		const { reportBase64, reportData } = await this.reportService.getReportData(this.carGid, date, filter, this.type).then((response: Response) => response.data);
		this.docBase64 = reportBase64;
		this.reportData = JSON.parse(reportData);
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
				this.reportData['sat'] = this.inputSat;
				this.reportData['comments'] = this.textAreaComments;
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
		const carGid = this.carGid;
		if (reportType) {
			this.reportService.changeReportType.next({
				type: reportType,
				carGid
			});
		} else {
			this.router.navigateByUrl(`/synthesis/${ carGid }`);
		}
	}

	back() {
		this.navigationService.back();
	}
}
