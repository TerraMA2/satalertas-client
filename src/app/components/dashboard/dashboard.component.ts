import {Component, OnInit} from '@angular/core';

import {ConfigService} from '../../services/config.service';

import {Alert} from '../../models/alert.model';

import {AlertGraphic} from '../../models/alert-graphic.model';

import {FilterService} from '../../services/filter.service';

import {LayerGroup} from '../../models/layer-group.model';

import {Layer} from '../../models/layer.model';

import {ParamAlert} from '../../models/param-alert.model';

import {SidebarService} from 'src/app/services/sidebar.service';

import {LayerType} from 'src/app/enum/layer-type.enum';

import {Response} from '../../models/response.model';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

    alertsDisplayed: Alert [] = [];
    alertGraphics: any [] = [];
    sidebarLayers: LayerGroup[];
    isLoading = false;

    constructor(
        private configService: ConfigService,
        private filterService: FilterService,
        private sidebarService: SidebarService
    ) {
    }

    ngOnInit() {
        this.isLoading = true;
        this.configService.getSidebarConfigurationDynamically().then((sidebarLayers: Response) => {
            this.sidebarLayers = sidebarLayers.data;

            this.sidebarService.sidebarLayerShowHide.next(false);

            this.setOverlayEvents();
            this.getGraphicLayers();
            this.isLoading = false;
        });
    }

    setOverlayEvents() {
        this.filterService.filterDashboard.subscribe(() => {
            this.alertsDisplayed = [];
            this.getGraphicLayers();
        });
    }

    setAlertsGraphics() {
        if (this.alertsDisplayed && this.alertsDisplayed.length > 0) {
            this.alertsDisplayed.forEach((alert: Alert) => {
                if (this.sidebarLayers && this.sidebarLayers.length > 0) {
                    this.sidebarLayers.forEach(group => {
                        if (group.cod === alert.codgroup) {
                            alert.alertsgraphics = this.getAlerts(group.children);
                        }
                    });
                }
            });
        }
    }

    setactivearea() {
        this.alertsDisplayed.forEach(alert => {
            if (alert.activearea) {
                this.onAreaClick(alert);
            }
        });
    }

    getidviewAlert(group: LayerGroup) {
        const alert = new Alert(
            0,
            '',
            group.cod,
            group.label,
            0,
            0,
            group.cod === 'DETER',
            group.cod === 'DETER',
            false,
            [],
            true,
            true,
            group.tableOwner,
            group.tableName);

        group.children.forEach((view: Layer) => {
            if (view.isPrimary && view.type === LayerType.ANALYSIS) {
                alert.cod = view.cod;
                alert.idview = view.value;
                alert.tableOwner = view.tableOwner;
                alert.tableName = view.tableName;
            }
        });
        return alert;
    }

    onAreaClick(alertSelected) {
        this.cleanActive();

        this.activeArea(alertSelected.alertsgraphics);

        this.filterService.getDetailsAnalysisTotals(alertSelected.alertsgraphics).then((alertsGraphics: AlertGraphic[]) => {
            this.alertGraphics = alertsGraphics;

            this.alertGraphics.forEach(graphic => {
                graphic.graphics[0].data.datasets[0].label = graphic.codGroup === 'BURNED' ? 'Quantidade de alertas de focos por CAR' : 'Área (ha) de alertas por CAR';
                graphic.graphics[1].data.datasets[0].label = graphic.codGroup === 'BURNED' ? 'Quantidade de alertas de focos por Bioma' : 'Área (ha) de alertas por classe';

                graphic.graphics[0].data.datasets[0].backgroundColor = '#591111';
                graphic.graphics[1].data.datasets[0].backgroundColor = '#591111';

                graphic.graphics[0].data.datasets[0].hoverBackgroundColor = '#874847';
                graphic.graphics[1].data.datasets[0].hoverBackgroundColor = '#874847';
            });

            alertSelected.activearea = true;
            alertSelected.immobileactive = false;

            if (this.alertGraphics && this.alertGraphics.length > 0) {
                this.alertGraphics[0].active = true;
            }
        });
    }

    onNubermImmobileClick(alertSelected) {
        this.cleanActive();

        this.activeImmobile(alertSelected.alertsgraphics);

        this.filterService.getDetailsAnalysisTotals(alertSelected.alertsgraphics).then((alertsGraphics: AlertGraphic[]) => {
            this.alertGraphics = alertsGraphics;


            this.alertGraphics.forEach(graphic => {
                graphic.graphics[0].data.datasets[0].label = graphic.codGroup === 'BURNED' ? 'Quantidade de alertas de focos por CAR' : 'Quantidade de alertas por CAR';
                graphic.graphics[1].data.datasets[0].label = graphic.codGroup === 'BURNED' ? 'Quantidade de alertas de focos por Bioma' : 'Quantidade de alertas por classe';

                graphic.graphics[0].data.datasets[0].backgroundColor = '#591111';
                graphic.graphics[1].data.datasets[0].backgroundColor = '#591111';

                graphic.graphics[0].data.datasets[0].hoverBackgroundColor = '#874847';
                graphic.graphics[1].data.datasets[0].hoverBackgroundColor = '#874847';
            });
            alertSelected.immobileactive = true;
            alertSelected.activearea = false;

            if (this.alertGraphics && this.alertGraphics.length > 0) {
                this.alertGraphics[0].active = true;
            }
        });
    }

    private async getGraphicLayers() {
        const listAlerts: Alert[] = [];

        this.sidebarLayers.forEach((group: LayerGroup) => {
            if (group && group.view_graph) {
                listAlerts.push(this.getidviewAlert(group));
            }
        });

        await this.filterService.getAnalysisTotals(listAlerts).then((alerts: Alert[]) => {
            this.alertsDisplayed = alerts;

            this.setAlertsGraphics();

            this.setactivearea();
        });
    }

    private cleanActive() {
        if (this.alertsDisplayed && this.alertsDisplayed.length > 0) {
            this.alertsDisplayed.forEach(groupLayer => {
                groupLayer.immobileactive = false;
                groupLayer.activearea = false;
            });
        }

        this.alertGraphics = [];
    }

    private adjustGraphValues(alertsGraphics) {
        const listAlertGraphics = [];

        this.filterService.getDetailsAnalysisTotals(alertsGraphics);

        this.alertGraphics = listAlertGraphics; // ListAlertGraphic.listAlertsGraphic;
    }

    private activeArea(alertsgraphics) {
        if (alertsgraphics && alertsgraphics.length > 0) {
            alertsgraphics.forEach(alert => {
                alert.activearea = true;
            });
        }
    }

    private activeImmobile(alertsgraphics) {
        if (alertsgraphics && alertsgraphics.length > 0) {
            alertsgraphics.forEach(alert => {
                alert.activearea = false;
            });
        }
    }

    private getAlerts(layers) {
        const listAlert: ParamAlert[] = [];

        layers.forEach(layer => {
            listAlert.push(new ParamAlert(
                layer.value,
                layer.cod,
                layer.codgroup,
                layer.label,
                true,
                layer.isPrimary,
                layer.type === LayerType.ANALYSIS,
                layer.tableOwner,
                layer.tableName)
            );
        });

        return listAlert;
    }
}
