import {Component, OnInit} from '@angular/core';

import {ConfigService} from '../../services/config.service';
import {Alert} from '../../models/alert.model';
import {AlertGraphic} from '../../models/alert-graphic.model';
import ListAlert from '../../../assets/listAlert.json';
import ListAlertGraphic from '../../../assets/listAlertGraphic.json';
import {Graphic} from '../../models/Graphic.model';

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
  ) { }

  ngOnInit() {
    this.getGraphicLayers(this.configService.getConfig('sidebar').sidebarItems);
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
        const date = new Date();

        // tslint:disable-next-line:max-line-length
        alert.area = (Math.round(Math.random() * (100000.558)) * date.getMilliseconds() * date.getSeconds() / date.getMinutes() / date.getHours());
        // tslint:disable-next-line:max-line-length
        alert.numCar = (Math.round(Math.random() * (10000) * date.getMilliseconds() * date.getSeconds() / date.getMinutes() / date.getHours()));

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

  private getListAlertsGraphics(cod, type) {
    const listAlertsGraphics: AlertGraphic[] = [];
    const childrenLayer = this.getLayer(cod);

    childrenLayer.forEach(layer => {
      listAlertsGraphics.push(this.getAlertGraphics(cod, type, layer));
    });

    return listAlertsGraphics;
  }

  onAreaClick(alertSelected) {
    this.cleanActive();
    this.alertGraphics = this.getListAlertsGraphics(alertSelected.cod, 'AREA');

    alertSelected.activeArea = true;
    alertSelected.immobileActive = false;

    this.alertGraphics[0].active = true;
  }

  private getAlertGraphics(cod, type, layer) {
    const listAlertsGraphic = ListAlertGraphic.listAlertsGraphic;
    let alertSelected: AlertGraphic;

    // @ts-ignore
    listAlertsGraphic.forEach((alertGraphic: AlertGraphic) => {
      if ((cod === alertGraphic.cod) && (type === alertGraphic.type)) {
        this.setValues(alertGraphic.graphicCity);
        this.setValues(alertGraphic.graphicBiome);

        alertSelected = new AlertGraphic(
          alertGraphic.cod,
          alertGraphic.label,
          alertGraphic.labelCity,
          alertGraphic.labelBiome,
          alertGraphic.type,
          alertGraphic.nameType,
          alertGraphic.idView,
          alertGraphic.active,
          alertGraphic.graphicCity,
          alertGraphic.graphicBiome
        );
      }
    });

    return alertSelected;
  }

  setValues(graphic: Graphic) {
    const data = [300, 50, 100, 15, 158, 1000, 339];
    this.adjustColor(graphic.datasets[0]);
    this.setSubtitle(graphic);

    graphic.datasets[0].data = [];
  }

  setSubtitle(graphic: Graphic) {
    graphic.labels = [];
  }

  adjustColor(dataset) {
/*    ,
      "backgroundColor": [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#36A2EB",
      "#FFCE56",
      "#36A2EB",
      "#FFCE56"
    ],
      "hoverBackgroundColor": [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#36A2EB",
      "#FFCE56",
      "#36A2EB",
      "#FFCE56"
    ]*/

    dataset.hoverBackgroundColor = [];

    dataset.backgroundColor = [];
  }

  onNubermImmobileClick(alertSelected) {
    this.cleanActive();
    this.alertGraphics = this.getListAlertsGraphics(alertSelected.cod, 'NUM_CAR');

    alertSelected.immobileActive = true;
    alertSelected.activeArea = false;
    this.alertGraphics[0].active = true;
  }

  private cleanActive() {
    this.alertsDisplayed.forEach( groupLayer => {
      groupLayer.immobileActive = false;
      groupLayer.activeArea = false;
    });

    this.alertGraphics = [];
  }
}
