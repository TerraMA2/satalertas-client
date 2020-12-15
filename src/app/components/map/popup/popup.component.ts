import {Component, OnInit} from '@angular/core';

import {MapService} from '../../../services/map.service';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
    public layerLabel: string;
    public tableData;
    public linkSynthesis: string;
    public linkDETER: string;
    public linkPRODES: string;
    public linkBurnlight: string;

    constructor(
        public mapService: MapService) {
    }

    ngOnInit() {
    }

    formatCPFCNPJ(data) {
        return this.mapService.formatterCpfCnpj(data);
    }
}
