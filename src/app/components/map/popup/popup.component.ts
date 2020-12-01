import {Component, OnInit} from '@angular/core';

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

    constructor() {
    }

    ngOnInit() {
    }

}
