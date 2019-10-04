import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../../services/config.service';
import {LayerGroup} from '../../models/layer-group.model';
import {Alert} from '../../models/alert.model';
import {Control} from 'leaflet';
import Layers = Control.Layers;

import ListAlert from '../../../assets/listAlert.json';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  data: any;

  alertsDisplayed: Alert [] = [];

  alertGraphics: Layers [] = [];

  constructor(
    private configService: ConfigService
  ) {}

  ngOnInit() {
    this.getGraphicLayers(this.configService.getConfig('sidebar').sidebarItems);

    this.data = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ]
        }]
    };
  }

  getGraphicLayers(sidebarItems) {
    sidebarItems.forEach(layerGroup => {
      if (layerGroup.viewGraph) {
        this.alertsDisplayed.push(this.getValueAlert(layerGroup));

        if (layerGroup.activeArea) { this.onAreaClick(this.getValueAlert(layerGroup)); }

      }
    });
  }

  getValueAlert(layerGroup) {
    let value = null;
    ListAlert.listAlert.forEach( alert => {
      if (layerGroup.cod === alert.cod) {
        value = alert;
      }
    });
    return value;
  }

  onAreaClick(alertSelected) {
    this.cleanActive();
    const listLayer = this.getLayer(alertSelected.cod);

    alertSelected.activeArea = true;
    alertSelected.immobileActive = false;

    listLayer.forEach( layer => {
      layer.nameType = 'Área';
      this.alertGraphics.push(layer);
    });

    console.log(listLayer);
  }

  onNubermImmobileClick(alertSelected) {
    this.cleanActive();
    const listLayer = this.getLayer(alertSelected.cod);

    alertSelected.immobileActive = true;
    alertSelected.activeArea = false;


    listLayer.forEach( layer => {
       layer.nameType = 'Número de Cars';
       this.alertGraphics.push(layer);
    });

    console.log(listLayer);
  }

  getLayer(cod) {
    const sidebarItens = this.configService.getConfig('sidebar').sidebarItems;
    let itemSelected = null;

    sidebarItens.forEach(item => {
      if (cod === item.cod) {
        this.setSelectedGraphic(item.children)
        itemSelected = item.children;
      }
    });
    return itemSelected;
  }

  setSelectedGraphic(list) {
    list.forEach(item => {
      item.active = false;
    });
    list[0].active = true;
  }

  cleanActive() {
    this.alertsDisplayed.forEach( groupLayer => {
      groupLayer.immobileActive = false;
      groupLayer.activeArea = false;
    });
    this.alertGraphics = [];
  }

}
