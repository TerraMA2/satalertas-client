import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../../services/sidebar.service';
import { Location } from '@angular/common';

import { GroupViewService } from 'src/app/services/group-view.service';
import { GroupService } from 'src/app/services/group.service';
import { MessageService, SelectItem } from 'primeng/api';
import { Group } from '../../../models/group.model';
import { Response } from '../../../models/response.model';

@Component({
	selector: 'app-layers',
	templateUrl: './layers.component.html'
})

export class LayersComponent implements OnInit {
	groups: SelectItem[];
	selectedGroup;
	availableLayers;
	selectedLayers;
	groupLayersReceived = [];
	appendedLayers = [];
	removedLayers = [];
	groupOwner;
	saveEdition: boolean = false;

	constructor(
		private sidebarService: SidebarService,
		private location: Location,
		private groupViewService: GroupViewService,
		private groupService: GroupService,
		private messageService: MessageService,
	) {
	}

	async ngOnInit() {
		this.sidebarService.sidebarReload.next('settings');
		await this.getAllGroups();
	}

	async getAllGroups() {
		this.groupService.getAll().then((data) => {
			if (data) {
				this.groups = data.map((group: Group) => ({ label: group.name, value: group.id }));
			}
		});
	}

	async onChangeOptionField(event) {
		const group = event.value;
		if (group) {
			await this.groupViewService.getByGroupId(group.value)
				.then((response: Response) => {
						let groupViews = response.data;
						if (groupViews) {
							groupViews = groupViews.filter(layer => layer.name);
							this.selectedLayers = groupViews;
							this.groupLayersReceived = [...groupViews];
						}
					}
				)
			this.groupViewService.getAvailableLayers(group.value).then((response: Response) => {
				const availableGroupViews = response.data;
				if (availableGroupViews && Array.isArray(availableGroupViews) && availableGroupViews.length > 0) {
					this.availableLayers = availableGroupViews;
					// this.availableLayers = availableGroupViews.map((availableGroupView) => ({name: availableGroupView.name, viewId: availableGroupView.id}));
				}
				return [];
			});
		} else {
			this.selectedLayers = [];
			this.availableLayers = [];
		}
	}

	async save() {
		const layers = this.selectedLayers
			.map(layerId => ({
				groupId: this.selectedGroup.value, viewId: layerId.id
			}));
		const params = {
			groupId: this.selectedGroup.value,
			layers
		};
		if (this.groupOwner["id"]) {
			params['groupOwner'] = this.groupOwner["id"];
		}
		this.groupViewService.update(params)
			.then(() => {
				this.messageService.add({
					severity: 'success',
					summary: 'Sucesso',
					detail: 'Camadas do grupo atualizadas'
				});
				this.saveEdition = false;
			});
	}
	async appendLayer(param) {
		param.forEach(layer => {
			if (!this.groupLayersReceived.find(({ id }) => id === layer.id)) {
				this.appendedLayers.push(layer);
			}
		});
		this.saveEdition = true;
	}
	async removeLayer(param) {
		param.forEach(layer => {
			if (this.groupLayersReceived.find(({ id }) => id === layer.id)) {
				this.removedLayers.push(layer);
			}
		});
		this.saveEdition = true;
	}

	setGroupOwner(event) {
		if (!event.value) {
			this.groupOwner = {}
		} else {
			this.saveEdition = true;
		}
	}
}
