import { GroupService } from 'src/app/services/group.service';
import { GroupViewService } from '../../../services/group-view.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-layers-advanced',
	templateUrl: './layers-advanced.component.html',
	styleUrls: ['./layers-advanced.component.css'],
	providers: [MessageService, ConfirmationService]
})
export class LayersAdvancedComponent implements OnInit {
	groups;
	selectedGroup;
	groupLayers;
	availableLayers;
	codGroups;
	newGroupData = [];
	newDataLayer;
	displayModal = false;
	layer = {};
	layerEdition = {};
	edited: boolean;

	constructor(
		private sidebarService: SidebarService,
		private groupViewService: GroupViewService,
		private messageService: MessageService,
		private groupService: GroupService,
		private confirmationService: ConfirmationService,
	) {
	}

	async ngOnInit() {
		this.sidebarService.sidebarReload.next('settings');
		this.groupService.getAll().then((data) => {
			this.groups = data;
		});
	}

	joinSubLayerData(layers, subLayersIds) {
		return layers.filter(({ id }) => subLayersIds.includes(id));
	}

	async getGroupData(groupId) {
		if (groupId) {
			await this.groupViewService.getByGroupId(groupId)
				.then((data) => {
					data.forEach((item) => {
						if (item.sub_layers) {
							item.sub_layers = this.joinSubLayerData(data, item.sub_layers);
						}
					});
					this.groupLayers = data;
				});
		} else {
			this.groupLayers = [];
		}
	}

	async onGroupChange(event) {
		const group = event.value;
		this.selectedGroup = group;
		this.getGroupData(group);
		this.clearNewData();
	}

	editLayer(layerToEdit) {
		/*
		Sends the choosen layer to be edited at modal editor advanced.
		*/
		this.layer = { ...layerToEdit };
		this.availableLayers = this.groupLayers.filter((item) =>
			item.id_view !== layerToEdit.id_view && !item.is_primary
		);
		this.displayModal = true;
	};

	async cancelModalEdition() {
		this.displayModal = false;
		this.clearNewData();
	};

	setLayerAsPrimary(id) {
		this.groupLayers.forEach((layer) => {
			let subLayers = layer['sub_layers'] || [];
			const sbIdx = subLayers.findIndex(({ id: idx }) => idx === id);
			const newLayerData = this.newGroupData.find((newData) => newData.id === layer.id)
			if (sbIdx >= 0) {
				subLayers = subLayers.filter((item) => item.id !== id)
				if (newLayerData) {
					newLayerData['sub_layers'] = subLayers;
				} else {
					this.newGroupData.push({ id: layer.id, sub_layers: subLayers })
				}
			}
			if (layer.id === id) {
				layer['is_primary'] = true;
				layer['is_sublayer'] = false;
			}
		})
		const layerToEdit = this.newGroupData.find((layer) => layer.id === id)
		if (layerToEdit) {
			layerToEdit['is_primary'] = true;
			layerToEdit['is_sublayer'] = false;
		} else {
			this.newGroupData.push({ id, is_primary: true, is_sublayer: false })
		}
	}

	setLayersAsSubLayer(subLayers) {
		subLayers.forEach(subLayer => {
			const editedLayer = this.groupLayers.find((layer) => layer.id === subLayer.id);
			const newLayerData = this.newGroupData.find((layer) => layer.id === subLayer.id)
			if (!editedLayer["is_sublayer"]) {
				editedLayer["is_sublayer"] = true;
				editedLayer["is_primary"] = false;
				editedLayer["sub_layers"] = null;
			};
			if (newLayerData) {
				newLayerData['is_primary'] = false;
				newLayerData['is_sublayer'] = true;
				newLayerData["sub_layers"] = null;
			} else {
				this.newGroupData.push({
					id: subLayer.id,
					is_sublayer: true,
					is_primary: false,
					sub_layers: null,
				})
			}
		})
	}

	async getModalEditions() {
		this.displayModal = false;
		if (this.layerEdition.hasOwnProperty('is_sublayer')) {
			if (this.layerEdition["is_sublayer"] == false) {
				this.setLayerAsPrimary(this.layerEdition['id'])
			}
			const subLayersIds = this.layerEdition["sub_layers"];
			if (subLayersIds) {
				this.setLayersAsSubLayer(subLayersIds);
			}
		}
		const sbIdx = this.newGroupData.findIndex(({ id }) => id === this.layerEdition['id']);

		if (sbIdx >= 0) {
			const sbLyr = this.newGroupData[sbIdx];
			this.newGroupData[sbIdx] = { ...sbLyr, ...this.layerEdition };
		} else {
			this.newGroupData.push(this.layerEdition);
		}
		const layerToEdit = this.groupLayers.findIndex((item) => item.id === this.layerEdition['id']);
		if (layerToEdit >= 0) {
			this.groupLayers[layerToEdit] = { ...this.layer, ...this.layerEdition };
		}
		this.layerEdition = {};
		this.edited = true;
	}

	async saveGroupEdition() {
		this.confirmationService.confirm({
			message: 'Deseja salvar todas as edições feitas no grupo?',
			header: 'Atenção!',
			icon: 'pi pi-exclamation-triangle',
			accept: async () => {
				await this.groupViewService.updateAdvanced({
					id_group: this.selectedGroup,
					editions: this.newGroupData
				})
					.then(() => {
						this.onGroupChange({ value: this.selectedGroup });
						this.edited = false;
						this.messageService.add({
							severity: 'success',
							summary: 'Sucesso',
							detail: 'Edições Salvas',
							life: 3000
						});
					});
			}
		});
	}

	async cancelGroupEdition() {
		this.confirmationService.confirm({
			message: 'Esta ação irá cancelar TODAS as edições feitas neste grupom, deseja continuar?',
			header: 'Atenção!',
			icon: 'pi pi-exclamation-triangle',
			accept: async () => {
				await this.getGroupData(this.selectedGroup)
					.then(() => {
						this.clearNewData();
						this.edited = false;
						this.messageService.add({
							severity: 'success',
							summary: 'Sucesso',
							detail: 'Edições desfeitas',
							life: 3000
						});
					});
			}
		});
	}

	clearNewData() {
		this.newGroupData = [];
		this.layerEdition = {};
	}
}
