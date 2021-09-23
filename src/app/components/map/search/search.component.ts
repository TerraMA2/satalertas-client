import { Component, Input, OnInit } from '@angular/core';

import { SearchService } from '../../../services/search.service';

import { DeviceDetectorService } from 'ngx-device-detector';

import { MapService } from '../../../services/map.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  coordinatesDegreesLatitude: number;
  coordinatesDegreesLongitude: number;
  coordinatesMinutesLatitude: number;
  coordinatesMinutesLongitude: number;
  coordinatesSecondsLatitude: number;
  coordinatesSecondsLongitude: number;

  decimalDegreesLatitude: number;
  decimalDegreesLongitude: number;

  uTMCoordinatesEast: number;
  uTMCoordinatesNorth: number;
  uTMCoordinatesZone: number;

  @Input() displaySearch = false;

  isMobile = false;

  constructor(
    private searchService: SearchService,
    private mapService: MapService,
    private deviceDetectorService: DeviceDetectorService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  onCoordinateClicked() {
    try {
      const latitude = this.searchService.dMSToLatLng(this.coordinatesDegreesLatitude, this.coordinatesMinutesLatitude, this.coordinatesSecondsLatitude);
      const longitude = this.searchService.dMSToLatLng(this.coordinatesDegreesLongitude, this.coordinatesMinutesLongitude, this.coordinatesSecondsLongitude);
      this.mapService.setMapPosition.next([latitude, longitude]);
    } catch (error) {
      this.messageService.add({severity: 'error', summary: '', detail: error.message});
    }
  }

  onDecimalDegreesClicked() {
    try {
      const latitude = this.decimalDegreesLatitude;
      const longitude = this.decimalDegreesLongitude;
      const latLongValidation = this.searchService.validateLatLng(latitude, longitude);
      if (latLongValidation !== true) {
        this.messageService.add({severity: 'error', summary: '', detail: latLongValidation});
        return;
      }
      const latLng = [latitude, longitude];
      this.mapService.setMapPosition.next(latLng);
    } catch (error) {
      this.messageService.add({severity: 'error', summary: '', detail: error.message});
    }
  }

  onUTMCoordinateClicked() {
    try {
      const latLng = this.searchService.utmToLatLng(this.uTMCoordinatesEast, this.uTMCoordinatesNorth, this.uTMCoordinatesZone);
      this.mapService.setMapPosition.next(latLng);
    } catch (error) {
      this.messageService.add({severity: 'error', summary: '', detail: error.message});
    }
  }

  onSearchHide() {
    this.mapService.searchClose.next();
  }

}
