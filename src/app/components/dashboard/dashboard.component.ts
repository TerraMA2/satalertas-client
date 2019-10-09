import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../../services/config.service';
import {Alert} from '../../models/alert.model';

import ListAlert from '../../../assets/listAlert.json';
import {AlertGraphic} from '../../models/alert-graphic.model';
import ListAlertGraphic from '../../../assets/listAlertGraphic.json';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  alertsDisplayed: Alert [] = [];

  alertGraphics: AlertGraphic [] = [];

  constructor(
    private configService: ConfigService
  ) {}

  ngOnInit() {
    this.getGraphicLayers(this.configService.getConfig('sidebar').sidebarItems);
  }

  onAreaClick(alertSelected) {
    this.cleanActive();
    this.alertGraphics = this.getListAlertsGraphics(alertSelected.cod, 'AREA');

    alertSelected.activeArea = true;
    alertSelected.immobileActive = false;

    this.alertGraphics[0].active = true;
  }

  onNubermImmobileClick(alertSelected) {
    this.cleanActive();
    this.alertGraphics = this.getListAlertsGraphics(alertSelected.cod, 'NUM_CAR');

    alertSelected.immobileActive = true;
    alertSelected.activeArea = false;
    this.alertGraphics[0].active = true;
  }

  private getListAlertsGraphics(cod, type) {
    const listAlertsGraphics: AlertGraphic[] = [];
    const childrenLayer = this.getLayer(cod);

    childrenLayer.forEach(layer => {
      listAlertsGraphics.push(this.getAlertGraphics(cod, type, layer));
    });

    return listAlertsGraphics;
  }

  private getGraphicLayers(sidebarItems) {
    sidebarItems.forEach(layerGroup => {
      if (layerGroup.viewGraph) {
        this.alertsDisplayed.push(this.getValueAlert(layerGroup));

        if (layerGroup.activeArea) { this.onAreaClick(this.getValueAlert(layerGroup)); }

      }
    });
  }

  private getValueAlert(layerGroup) {
    let value = null;
    ListAlert.listAlert.forEach( alert => {
      if (layerGroup.cod === alert.cod) {
        value = alert;
      }
    });
    return value;
  }

  private getLayer(cod) {
    const sidebarItens = this.configService.getConfig('sidebar').sidebarItems;
    let itemSelected = null;

    sidebarItens.forEach(item => {
      if (cod === item.cod) {
        itemSelected = item.children;
      }
    });
    return itemSelected;
  }

  private getAlertGraphics(cod, type, layer) {
    const listAlertsGraphic = ListAlertGraphic.listAlertsGraphic;
    let alertSelected: AlertGraphic;

    listAlertsGraphic.forEach((alertGraphic: AlertGraphic) => {
      if ((cod === alertGraphic.cod) && (type === alertGraphic.type)) {
        const aGraphic = {
          cod: layer.cod,
          label:  layer.label,
          nameType: alertGraphic.nameType,
          type: alertGraphic.type,
          idView: parseInt(layer.idView, 10),
          active: false,
          graphicMunicipios: alertGraphic.graphicMunicipios,
          graphicBiomas: alertGraphic.graphicBiomas,
        };
        alertSelected = aGraphic;
      }
    });
    return alertSelected;
  }

  private cleanActive() {
    this.alertsDisplayed.forEach( groupLayer => {
      groupLayer.immobileActive = false;
      groupLayer.activeArea = false;
    });

    this.alertGraphics = [];
  }

}
