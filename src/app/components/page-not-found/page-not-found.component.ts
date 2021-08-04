import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';

@Component({
	selector: 'app-page-not-found',
	templateUrl: './page-not-found.component.html',
	styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

	constructor(
		private sidebarService: SidebarService
	) {
	}

	ngOnInit(): void {
		this.sidebarService.sidebarLayerShowHide.next(false);
		this.sidebarService.sidebarReload.next();
	}

}
