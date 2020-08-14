import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-sidebar-header',
    templateUrl: './sidebar-header.component.html',
    styleUrls: ['./sidebar-header.component.css']
})
export class SidebarHeaderComponent implements OnInit {

    @Input() sidebarLogo: string;

    @Input() sidebarLogoLink: string;

    constructor() {
    }

    ngOnInit() {
    }

}
