import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-popup-link',
    templateUrl: './popup-link.component.html',
    styleUrls: ['./popup-link.component.css']
})
export class PopupLinkComponent implements OnInit {
    public link: string;

    public title: string;

    constructor() {
    }

    ngOnInit() {
    }

}
