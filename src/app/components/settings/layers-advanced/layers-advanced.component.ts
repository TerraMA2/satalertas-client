import { GroupService } from 'src/app/services/group.service';
import { GroupViewService } from '../../../services/group-view.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { Response } from '../../../models/response.model';

@Component({
	selector: 'app-layers-advanced',
	templateUrl: './layers-advanced.component.html',
	styleUrls: ['./layers-advanced.component.css'],
	providers: [ConfirmationService]
})
export class LayersAdvancedComponent implements OnInit {
	groups;
	selectedGroup;
	groupLayers;
	availableLayers;
	groupCodes;
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
				.then((response: Response) => {
					this.groupLayers = response.data;
				});
		} else {
			this.groupLayers = [];
		}
	}

	async onGroupChange(event) {
		const group = event.value;
		this.selectedGroup = group;
		await this.getGroupData(group);
		this.clearNewData();
	}

	editLayer(layerToEdit) {
		/*
		Sends the choosen layer to be edited at modal editor advanced.
		*/
		this.layer = { ...layerToEdit };
		this.availableLayers = this.groupLayers.filter((item) =>
			item.viewId !== layerToEdit.viewId)
			.filter(item => !item.isPrimary);
		this.displayModal = true;
	};

	async cancelModalEdition() {
		this.displayModal = false;
		this.clearNewData();
	};

	setLayerAsPrimary(id) {
		this.groupLayers.forEach((layer) => {
			let subLayers = layer['subLayers'] || [];
			const sbIdx = subLayers.findIndex(({ id: idx }) => idx === id);
			const newLayerData = this.newGroupData.find((newData) => newData.id === layer.id)
			if (sbIdx >= 0) {
				subLayers = subLayers.filter((item) => item.id !== id)
				if (newLayerData) {
					newLayerData['subLayers'] = subLayers;
				} else {
					this.newGroupData.push({
						id: layer.id, subLayers, isSublayer: false
					})
				}
			}
			if (layer.id === id) {
				layer['isPrimary'] = true;
				layer['isSublayer'] = false;
			}
		})
		const layerToEdit = this.newGroupData.find((layer) => layer.id === id)
		if (layerToEdit) {
			layerToEdit['isPrimary'] = true;
			layerToEdit['isSublayer'] = false;
		} else {
			this.newGroupData.push({ id, isPrimary: true, isSublayer: false })
		}
	}

	setLayersAsSubLayer(subLayers) {
		subLayers.forEach(subLayer => {
			const editedLayer = this.groupLayers.find((layer) => layer.id === subLayer.id);
			const newLayerData = this.newGroupData.find((layer) => layer.id === subLayer.id)
			const subLayerParams = {
				isSublayer: true, isPrimary: false, subLayers: null,
			}
			if (editedLayer || !editedLayer['isSublayer']) {
				Object.assign(editedLayer, subLayerParams)
			};
			if (newLayerData) {
				Object.assign(newLayerData, subLayerParams)
			} else {
				this.newGroupData.push({
					id: subLayer.id, ...subLayerParams
				})
			}
		})
	}

	async getModalEditions() {
		this.displayModal = false;
		if (this.layerEdition.hasOwnProperty('isPrimary') ||
			this.layerEdition.hasOwnProperty('subLayers')) {
			if (this.layerEdition['isPrimary']) {
				this.setLayerAsPrimary(this.layerEdition['id'])
			}
			const subLayersIds = this.layerEdition['subLayers'];
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
					groupId: this.selectedGroup,
					editions: this.newGroupData
				}).then(() => {
						this.onGroupChange({ value: this.selectedGroup });
						this.edited = false;
						this.messageService.add({
							severity: 'success',
							summary: '',
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
							summary: '',
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
