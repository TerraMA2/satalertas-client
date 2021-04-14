import {Component, Input, OnInit} from '@angular/core';

import {SidebarItem} from 'src/app/models/sidebar-item.model';

import {HTTPService} from '../../../../services/http.service';

import {SelectItem} from 'primeng-lts/api';

@Component({
    selector: 'app-sidebar-item',
    templateUrl: './sidebar-item.component.html',
    styleUrls: ['./sidebar-item.component.css']
})
export class SidebarItemComponent implements OnInit {

    @Input() sidebarItem: SidebarItem;

    selectedDropdownItem;

    dropdownData: SelectItem[];
    constructor(
        private hTTPService: HTTPService
    ) {
    }

    ngOnInit() {
        this.getDropdownData(); // DO NOT REMOVE
    }

    private getDropdownData() {
        // DO NOT REMOVE.
        // const dataUrl = this.sidebarItem.dataUrl;
        // if (dataUrl) {
            // const dropdownJsonExample = [ // JSON that must be returned from the server
            //     {
            //         label: 'project1',
            //         value: 1
            //     },
            //     {
            //         label: 'project2',
            //         value: 2
            //     }
            // ];
            // this.dropdownData = dropdownJsonExample;
            // this.hTTPService.get(dataUrl).subscribe((data: any) => {
            //   this.dropdownData = data;
            // });
        // }
    }
}
