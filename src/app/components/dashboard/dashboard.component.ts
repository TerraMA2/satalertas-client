import {Component, OnInit} from '@angular/core';

import {ConfigService} from '../../services/config.service';
import {Alert} from '../../models/alert.model';
import {AlertGraphic} from '../../models/alert-graphic.model';
import ListAlertGraphic from '../../../assets/listAlertGraphic.json';
import {ReportService} from '../../services/report.service';
import {FilterService} from '../../services/filter.service';
import {LayerGroup} from '../../models/layer-group.model';
import {Layer} from '../../models/layer.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  alertsDisplayed: Alert [] = [];
  alertGraphics: any [] = [];

  constructor(
    private configService: ConfigService,
    private reportService: ReportService,
    private filterService: FilterService
  ) { }


  ngOnInit() {
    this.setOverlayEvents();

    this.getGraphicLayers(this.configService.getConfig('sidebar').sidebarItems);
  }

  setOverlayEvents() {
    this.filterService.filterDashboard.subscribe(() => {
      this.alertsDisplayed = [];
      this.getGraphicLayers(this.configService.getConfig('sidebar').sidebarItems);
    });
  }

  private async getGraphicLayers(sidebarItems: LayerGroup[]) {
    const listAlerts: Alert[] = [];

    sidebarItems.forEach((layerGroup: LayerGroup) => {
      if (layerGroup.viewGraph) {
        listAlerts.push(this.getidviewAlert(layerGroup));
      }
    });

    await this.reportService.getAnalysisTotals( listAlerts ).then( (alerts: Alert[]) => {
      this.alertsDisplayed = alerts;
      this.setactivearea();
    });
  }

  setactivearea() {
    this.alertsDisplayed.forEach(alert => {
      if (alert.activearea) {
        this.onAreaClick(alert);
      }
    });
  }

  getidviewAlert(layerGroup: LayerGroup) {

    const alert = new Alert(
      0,
      '',
      layerGroup.cod,
      layerGroup.label,
      0,
      0,
      layerGroup.cod === 'DETER',
      layerGroup.cod === 'DETER',
     false);

    layerGroup.children.forEach( (view: Layer) => {
      if ('CAR_X_FOCOS' === view.cod) {
        alert.cod = view.cod;
        alert.idview = view.value;
      }
      if (view.cod === 'CAR_X_PRODES') {
        alert.cod = view.cod;
        alert.idview = view.value;
      }
      if (view.cod === 'CAR_X_DETER') {
        alert.cod = view.codgroup;
        alert.idview = view.value;
      }
      if (view.cod === 'CAR_X_AREA_QUEIMADA') {
        alert.cod = view.codgroup;
        alert.idview = view.value;
      }
    });

    return alert;
  }

  onAreaClick(alertSelected) {
    this.cleanActive();

    this.alertGraphics = ListAlertGraphic.listAlertsGraphic;

    alertSelected.activearea = true;
    alertSelected.immobileactive = false;

    this.alertGraphics[0].active = true;
  }

  onNubermImmobileClick(alertSelected) {
    this.cleanActive();

    this.alertGraphics = ListAlertGraphic.listAlertsGraphic;

    alertSelected.immobileactive = true;
    alertSelected.activearea = false;
    this.alertGraphics[0].active = true;
  }

  private cleanActive() {
    this.alertsDisplayed.forEach( groupLayer => {
      groupLayer.immobileactive = false;
      groupLayer.activearea = false;
    });

    this.alertGraphics = [];
  }
}
