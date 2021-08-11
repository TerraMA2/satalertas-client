import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { LayerGroup } from 'src/app/models/layer-group.model';
import { Layer } from 'src/app/models/layer.model';
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
		// this.setItems();
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
		if (!this.sidebarConfig.sidebarItems) {
			return;
		}
		this.sidebarItems = [];
		this.sidebarConfig.sidebarItems.forEach(sbItem => {
			if (sbItem.auth && !this.isAuthenticated) {
				return;
			}
			const sidebarItem = this.getSidebarItem(sbItem);
			this.sidebarItems.push(sidebarItem);
		});
	}

	async getLayers(group) {
		const children: Layer[] = [];
		await this.groupViewService.getByGroupId(group.idGroup)
			.then((layerGroup) => {
				layerGroup.forEach((groupLayer) => {
					const layer = new Layer(
						groupLayer.name.split(' ').join('_'),
						group.cod,
						groupLayer.name,
						groupLayer.name,
						groupLayer.description,
						groupLayer.id_view,
						groupLayer.dateColumn,
						groupLayer.geomColumn,
						groupLayer.areaColumn,
						groupLayer.carRegisterColumn,
						groupLayer.classNameColumn,
						groupLayer.type,
						groupLayer.showMarker,
						groupLayer.isPrivate,
						groupLayer.isPrimary,
						groupLayer.isChild,
						groupLayer.isAlert,
						groupLayer.filter,
						groupLayer.layerData,
						groupLayer.legend,
						groupLayer.popupTitle,
						groupLayer.infoColumns,
						groupLayer.isHidden,
						groupLayer.isDisabled,
						groupLayer.tools,
						groupLayer.markerSelected,
						groupLayer.tableOwner,
						groupLayer.tableName
					);
					children.push(layer);
				});
			});
		return children;
	}

	async setSidebarLayers() { // traz todos os grupos e as camadas
		await this.sidebarService.getSidebarLayers().then((layers: Response) => {
			this.sidebarLayers = layers.data; // todas as camadas
			this.sidebarLayerGroups = []; // grupos de camadas que aparecem no SB
			if (this.sidebarLayers) {
				this.sidebarLayers.forEach(sidebarLayer => {
					const layerChildren: Layer[] = [];
					let children = null; // Recebe Todas as camadas do grupo
					if (sidebarLayer) {
						children = sidebarLayer.children;
					}
					if (children) { // construindo cada camada.
						sidebarLayer.children.forEach((sidebarLayerChild, index) => {
							let layer; // Camada
							// console.log(sidebarLayerChild)
							if (!sidebarLayerChild.isHidden) {
								layer = new Layer(
									sidebarLayerChild.cod,
									sidebarLayerChild.codgroup,
									sidebarLayerChild.label,
									sidebarLayerChild.shortLabel,
									sidebarLayerChild.description,
									sidebarLayerChild.value,
									sidebarLayerChild.dateColumn,
									sidebarLayerChild.geomColumn,
									sidebarLayerChild.areaColumn,
									sidebarLayerChild.carRegisterColumn,
									sidebarLayerChild.classNameColumn,
									sidebarLayerChild.type,
									sidebarLayerChild.showMarker,
									sidebarLayerChild.isPrivate,
									sidebarLayerChild.isPrimary,
									sidebarLayerChild.isChild,
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
								layerChildren.push(layer); // monta a camada
							}
						});
					}
					// monta o grupo de camadas
					const layerGroup = new LayerGroup(
						'',
						sidebarLayer.cod,
						sidebarLayer.label,
						sidebarLayer.parent,
						sidebarLayer.isPrivate,
						sidebarLayer.icon,
						sidebarLayer.view_graph,
						sidebarLayer.activeArea,
						layerChildren,
						sidebarLayer.tableOwner
					);
					this.sidebarLayerGroups.push(layerGroup); // insere o grupo na lista
				});
			}
		});

		await this.groupService.getAll().then((groups) => {
			if (!groups || Object.keys(groups).length === 0) {
				return;
			}
			groups.forEach(async (groupLyr) => {
				const layerGroup = new LayerGroup(
					groupLyr.id,
					groupLyr.cod,
					groupLyr.name,
					true, // Ver possibilidade de remover
					false, // Mostrar se estiver logado
					'',
					groupLyr.view_graph,
					false,
				);
				layerGroup.children = await this.getLayers(layerGroup);
				this.sidebarLayerGroups.push(layerGroup);
			});
		});
	}

	getSidebarItem(sidebarItem) {
		return new SidebarItem(
			sidebarItem.label,
			sidebarItem.link,
			sidebarItem.method,
			sidebarItem.dataUrl,
			sidebarItem.value,
			sidebarItem.icon,
			sidebarItem.separator,
			sidebarItem.auth
		);
	}

}
