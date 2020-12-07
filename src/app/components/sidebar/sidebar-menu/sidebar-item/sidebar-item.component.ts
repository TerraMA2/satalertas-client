import {Component, Input, OnInit} from '@angular/core';

import {SidebarItem} from 'src/app/models/sidebar-item.model';

import {Router} from '@angular/router';

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
        private router: Router,
        private hTTPService: HTTPService
    ) {
    }

    ngOnInit() {
        // this.getDropdownData(); // DO NOT REMOVE
    }

    onSidebarItemClicked() {
        if (this.sidebarItem.link) {
            this.router.navigateByUrl(this.sidebarItem.link);
        } else if (this.sidebarItem.method) {
            this[this.sidebarItem.method]();
        }
    }

    private getDropdownData() {
        // DO NOT REMOVE.
        // const dataUrl = this.sidebarItem.dataUrl;
        // if (dataUrl) {
        //     this.dropdownData = [
        //         {
        //             label: 'project1',
        //             value: 1
        //         },
        //         {
        //             label: 'project2',
        //             value: 2
        //         }
        //     ];
        //     this.hTTPService.get(dataUrl).subscribe((data: any) => {
        //       this.dropdownData = data;
        //     });
        // }
    }
}
