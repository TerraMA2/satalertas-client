import { Component, OnInit, AfterViewInit, Input } from '@angular/core';

import { ConfigService } from 'src/app/services/config.service';

import { Vision } from 'src/app/models/vision.model';

import * as L from 'leaflet';

import { Property } from 'src/app/models/property.model';

@Component({
  selector: 'app-vision',
  templateUrl: './vision.component.html',
  styleUrls: ['./vision.component.css']
})
export class VisionComponent implements OnInit, AfterViewInit {

  private visionConfig;

  @Input() property: Property;

  carRegister: string;

  visions: Vision[] = [];

  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.visionConfig = this.configService.getConfig('report');

    const visionsData = this.visionConfig.visions;

    visionsData.forEach((visionData: Vision) => {
      const vision = new Vision(
        visionData.id,
        visionData.title,
        visionData.image,
        visionData.description
      );
      this.visions.push(vision);
    });

  }
  ngAfterViewInit() {
    this.visions.forEach((vision: Vision) => {
      const baseLayer = L.tileLayer.wms('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        layers: '',
        format: '',
        version: '',
        crossOrigin: 'anonymous',
        transparent: true,
        attribution: '&copy; <a href=\'https://www.openstreetmap.org/copyright\'>OpenStreetMap</a>'
      });

      const layer = L.tileLayer.wms(`http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms?cql_filter=numero_do2='${this.carRegister}'`, {
        layers: vision.image,
        format: 'image/png',
        version: '1.1.0',
        crossOrigin: 'anonymous',
        transparent: true,
        attribution: '&copy; <a href=\'https://www.openstreetmap.org/copyright\'>OpenStreetMap</a>'
      });

      const map = L.map(vision.id, {
        attributionControl: false,
        zoomControl: false,
        dragging: false,
        touchZoom: false,
        boxZoom: false,
        scrollWheelZoom: false,
        layers: [
          baseLayer
        ]
      });

      const propertyBBox = this.property.bbox.split(',');
      const bounds  = L.latLngBounds(
        [Number(propertyBBox[3]), Number(propertyBBox[2])],
        [Number(propertyBBox[1]), Number(propertyBBox[0])]
      );
      // const bounds  = L.latLngBounds(
      //   [-12.59399277, -57.2847452],
      //   [-12.30850863, -56.90282508]
      // );
      map.fitBounds(bounds);

      // map.setView([-12.774877, -55.925554], 5);
      // map.setView([-15.13248778, -59.24993556], 5);
      layer.addTo(map);
    });
  }
}
