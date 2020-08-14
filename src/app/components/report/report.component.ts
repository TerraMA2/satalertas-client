import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';

import {Property} from 'src/app/models/property.model';

import {ConfigService} from 'src/app/services/config.service';

import {Vision} from 'src/app/models/vision.model';

import {Legend} from 'src/app/models/legend.model';

import {ReportService} from 'src/app/services/report.service';

import {FilterService} from 'src/app/services/filter.service';

import {SidebarService} from 'src/app/services/sidebar.service';

import {Response} from '../../models/response.model';

import Chart from 'chart.js';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

    points: any[] = [];
    carRegister: string;
    property: Property;
    bbox: string;
    cityBBox: string;
    visions: Vision[] = [];
    detailedVisions: Vision[] = [];
    deforestations: Vision[] = [];
    deforestationHistoryDeters: Vision[] = [];
    historyDeterChartData: any;
    deforestationHistoryProdes: Vision[] = [];
    historyProdesChartData: any;
    deforestationHistories: Vision[] = [];
    burningSpotlights: Vision[] = [];
    burningSpotlightsChartData: any;
    burnedAreas: Vision[] = [];
    burnedAreasChartData: any;
    burnedAreasPerPropertyChartDatas: any[] = [];
    landsatHistories: Vision[] = [];
    visionLegends: Legend[] = [];
    formattedFilterDate: string;
    chartImages = [];
    private reportConfig;
    isLoading = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private configService: ConfigService,
        private reportService: ReportService,
        private filterService: FilterService,
        private sidebarService: SidebarService,
        private router: Router,
    ) {
    }

    async ngOnInit() {
        this.filterService.filterReport.subscribe(() => {
            if (this.router.url.startsWith('/report')) {
                this.getPropertyData();
            }
        });
        this.activatedRoute.params.subscribe(params => this.carRegister = params.carRegister);

        this.reportConfig = await this.configService.getReportConfig().then((response: Response) => response.data);

        this.visionLegends = this.reportConfig.visionslegends;

        this.sidebarService.sidebarLayerShowHide.next(false);

        await this.getPropertyData();
    }

    async getPropertyData() {
        this.isLoading = true;
        const date = JSON.parse(localStorage.getItem('dateFilter'));
        const startDate = new Date(date[0]).toLocaleDateString('pt-BR');
        const endDate = new Date(date[1]).toLocaleDateString('pt-BR');

        const filter = JSON.parse(localStorage.getItem('filterList'));

        this.formattedFilterDate = `${startDate} - ${endDate}`;

        await this.reportService.getSynthesisCarData(this.carRegister, date, filter).then(async (response: Response) => {
            const propertyData = response.data;

            const burnedAreas = propertyData.burnedAreasYear;

            const area = propertyData.area;

            this.property = propertyData;

            this.visions = this.reportService.getVisions(propertyData, this.reportConfig.visions);

            this.detailedVisions = this.reportService.getVisions(propertyData, this.reportConfig.detailedVisions);

            this.deforestations = this.reportService.getVisions(propertyData, this.reportConfig.deforestations);

            this.deforestationHistoryDeters = this.reportService.getVisions(propertyData, this.reportConfig.deforestationHistoryDeters, 'deterYear');

            this.historyDeterChartData = this.reportService.getHistoryDeterChart(propertyData.deterYear);

            this.deforestationHistoryProdes = this.reportService.getVisions(propertyData, this.reportConfig.deforestationHistoryProdes);

            this.historyProdesChartData = this.reportService.getHistoryProdesChart(propertyData.prodesYear);

            this.burnedAreas = this.reportService.getVisions(propertyData, this.reportConfig.burnedAreasYear, 'burnedAreasYear');

            this.burningSpotlights = this.reportService.getVisions(propertyData, this.reportConfig.burningSpotlights, 'spotlightsYear');

            this.burningSpotlightsChartData = this.reportService.getBurningSpotlightsChart(propertyData.spotlightsYear);

            this.burnedAreasChartData = this.reportService.getBurnedAreasChart(burnedAreas);

            this.burnedAreasPerPropertyChartDatas = this.reportService.getBurnedAreasPerPropertyChart(burnedAreas, area);

            this.points = await this.reportService.getPointsAlerts(this.carRegister.replace('\\', '/'), date, filter, 'prodes').then(async (resp: Response) => await resp.data);

            await this.setChartNdvi();

            this.isLoading = false;
        });
    }

    onViewReportClicked(reportType) {
        this.router.navigateByUrl(`/finalReport/${reportType}/${this.carRegister.replace('/', '\\')}`);
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

    async setChartNdvi() {
        for (let index = 0; index < this.points.length; index++) {
            const canvas: any = document.createElement('canvas');
            canvas.id = `myChart${index}`;
            canvas.setAttribute('width', 600);
            canvas.setAttribute('height', 200);
            canvas.setAttribute('style', 'display: none');

            document.body.appendChild(canvas);

            const ctx: any = canvas.getContext('2d');

            const myChart = new Chart(ctx, this.points[index].options);

            myChart.update({
                duration: 0,
                lazy: false,
                easing: 'easeOutBounce'
            });

            myChart.render();

            myChart.stop();

            const chartImage = {
                geoserverImageNdvi: await this.getBase64ImageFromUrl(this.points[index].url),
                myChart: this.points[index].options.data
            };
            this.chartImages.push(chartImage);
        }
    }

    trackById(index, item) {
        return item.id;
    }
}
