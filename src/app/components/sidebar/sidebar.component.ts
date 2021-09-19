import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { LayerGroup } from 'src/app/models/layer-group.model';
import { Layer } from 'src/app/models/layer.model';
import { LayerInt } from 'src/app/models/layer-class.model';
import { SidebarService } from 'src/app/services/sidebar.service';
import { MapService } from 'src/app/services/map.service';
import { SidebarItem } from 'src/app/models/sidebar-item.model';
import { Response } from '../../models/response.model';
import { GroupService } from 'src/app/services/group.service';
import { GroupViewService } from '../../services/group-view.service';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

	sidebarItems: SidebarItem[] = [];

	sidebarLayerGroups: LayerGroup[] = [];

	sidebarLayers: LayerGroup[] = [];

	sidebarConfig;

	logoPath: string;
	logoLink: string;

	isAuthenticated = false;

	constructor(
		private configService: ConfigService,
		private sidebarService: SidebarService,
		private mapService: MapService,
		private groupService: GroupService,
		private groupViewService: GroupViewService,
		private authService: AuthService
	) {
	}

	ngOnInit() {
		this.sidebarConfig = this.configService.getSidebarConfig();
		this.logoPath = this.sidebarConfig.logoPath;
		this.logoLink = this.sidebarConfig.logoLink;
		this.authService.user.subscribe(user => this.isAuthenticated = !!user);
		this.sidebarService.sidebarReload.subscribe((type) => {
			if (type === 'settings') {
				this.sidebarConfig = this.configService.getSidebarSettingsConfig();
				this.setSidebarItems();
				this.sidebarLayerGroups = [];
			} else {
				this.sidebarConfig = this.configService.getSidebarConfig();
				this.setItems();
			}
			this.mapService.clearMap.next();
		});
	}

	setItems() {
		this.setSidebarItems();
		this.setSidebarLayers();
	}

	setSidebarItems() {
		if (this.sidebarConfig.sidebarItems) {
			const sbItems = this.sidebarConfig.sidebarItems;
			if(this.isAuthenticated) {
				this.sidebarItems = sbItems;
			} else {
				this.sidebarItems = sbItems.filter(({auth}) => !auth );
			}
		}
	}

	async setSidebarLayers() { // traz todos os grupos e as camadas
		await this.sidebarService.getSidebarLayers().then((response: Response) => {
			this.sidebarLayers = response.data; // todas as camadas
			this.sidebarLayerGroups = []; // grupos de camadas que aparecem no SB
			if (this.sidebarLayers) {
				this.sidebarLayers.forEach(sidebarLayer => {
					const layerChildren: Layer[] = [];
					let children = null; // Recebe Todas as camadas do grupo
					if (sidebarLayer) {
						children = sidebarLayer.children;
					}
					if (children) { // construindo cada camada.
						sidebarLayer.children.forEach(sidebarLayerChild => {
							let layer; // Camada
							if (!sidebarLayerChild.isHidden) {
								layer = new LayerInt(
									sidebarLayerChild['cod'],
									sidebarLayerChild.groupCode,
									sidebarLayerChild.name,
									sidebarLayerChild.shortName,
									sidebarLayerChild.description,
									sidebarLayerChild.viewId,
									sidebarLayerChild.dateColumn,
									sidebarLayerChild.geomColumn,
									sidebarLayerChild.areaColumn,
									sidebarLayerChild.carRegisterColumn,
									sidebarLayerChild.classNameColumn,
									sidebarLayerChild.type,
									sidebarLayerChild.showMarker,
									sidebarLayerChild.isPrivate,
									sidebarLayerChild.isPrimary,
									sidebarLayerChild.isSublayer,
									sidebarLayerChild.isAlert,
									sidebarLayerChild.filter,
									sidebarLayerChild.layerData,
									sidebarLayerChild.legend,
									sidebarLayerChild.popupTitle,
									sidebarLayerChild.infoColumns,
									sidebarLayerChild.isHidden,
									sidebarLayerChild.isDisabled,
									sidebarLayerChild.tools,
									sidebarLayerChild.markerSelected,
									sidebarLayerChild.tableOwner,
									sidebarLayerChild.tableName
								);
								layer.name = sidebarLayerChild['label'];
								layer.shortName = sidebarLayerChild['shortLabel'];
								layer.isSublayer = sidebarLayerChild['isChild'];
								layerChildren.push(layer); // monta a camada
							}
						});
					}
					// monta o grupo de camadas
					const layerGroup: LayerGroup = {
						id: '',
						code: sidebarLayer['cod'],
						name: sidebarLayer['label'],
						parent: sidebarLayer['parent'], // tirar
						isPrivate: sidebarLayer['isPrivate'], // tirar
						icon: sidebarLayer['icon'], // tirar
						dashboard: sidebarLayer['viewGraph'],
						activeArea: sidebarLayer['activeArea'], // Ver possibilidade de remover
						children: layerChildren,
						tableOwner: sidebarLayer['tableOwner'], // remover
						tableName: sidebarLayer['tableName'],
					};
					this.sidebarLayerGroups.push(layerGroup); // insere o grupo na lista
				});
			}
		});

		await this.groupService.getAll().then((groups) => {
			if (!groups || Object.keys(groups).length === 0) {
				return;
			}
			groups.forEach(async (groupLyr) => {
				groupLyr.parent = true;
				groupLyr.isPrivate = false;
				const groupViews = await this.groupViewService.getByGroupId({groupId: groupLyr.id})
				groupLyr.children = groupViews.data;
				this.sidebarLayerGroups.push(groupLyr);
			});
		});
	}
}
