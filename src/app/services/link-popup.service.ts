import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef } from '@angular/core';

import { PopupLinkComponent } from '../components/popup-link/popup-link.component';

import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class LinkPopupService {

  constructor(private cfr: ComponentFactoryResolver,
              private injector: Injector,
              private appRef: ApplicationRef) { }


  register(marker: L.Marker, link: string, title: string): void  {
    marker.on('click', $event  => this.popup($event.target, link, title) );
  }

  popup(marker: L.Marker, link: string, title: string) {
    const cmpFactory = this.cfr.resolveComponentFactory(PopupLinkComponent);
    const componentRef = cmpFactory.create(this.injector);
    componentRef.instance.link = link;
    componentRef.instance.title = title;
    this.appRef.attachView(componentRef.hostView);
    const popup = marker.getPopup();
    const popupElement = popup.getElement();
    popupElement.firstChild.firstChild.appendChild(componentRef.location.nativeElement);
  }
}