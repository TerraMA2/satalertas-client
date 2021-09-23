import { GroupService } from 'src/app/services/group.service';
import { SettingsService } from 'src/app/services/settings.service';
import { GroupViewService } from '../../../services/group-view.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { Response } from '../../../models/response.model';
import { InfoColumnsService } from 'src/app/services/info-columns.service';

@Component({
	selector: 'app-layers-advanced',
	templateUrl: './layers-advanced.component.html',
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
	columns = [];

	constructor(
		private sidebarService: SidebarService,
		private groupViewService: GroupViewService,
		private messageService: MessageService,
		private groupService: GroupService,
		private confirmationService: ConfirmationService,
		private settingsService: SettingsService,
		private infoColumnsService: InfoColumnsService,
	) {
	}

	async ngOnInit() {
		this.sidebarService.sidebarReload.next('settings');
		this.infoColumnsService.getByTableName('layers-advanced-edition')
			.then(({ data }) => {
				this.columns = data.tableInfocolumns
			})
		this.settingsService.openLayersAdvancedModal.subscribe((data) => {
			const { layer, availableLayers } = data;
			this.layer = { ...layer };
			this.availableLayers = availableLayers;
			this.displayModal = true;
		});
		this.settingsService.getLayersAdvancedModalEditions.subscribe(data => {
			this.displayModal = false;
			this.getModalEditions(data)
		})
		this.groupService.getAll().then((data) => {
			this.groups = data;
		});
	}

	joinSubLayerData(layers, subLayersIds) {
		return layers.filter(({ id }) => subLayersIds.includes(id));
	}

	async getGroupData(groupId) {
		if (groupId) {
			const params = {
				groupId,
				listSublayers: true
			}
			await this.groupViewService.getByGroupId(params)
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

	async cancelModalEdition() {
		this.displayModal = false;
		this.clearNewData();
	};

	async getModalEditions(edition) {
		this.displayModal = false;
		const indexToEdit = this.newGroupData.findIndex(({ id }) => id === edition['id']);
		if (indexToEdit >= 0) {
			const sbLyr = this.newGroupData[indexToEdit];
			this.newGroupData[indexToEdit] = { ...sbLyr, ...edition };
		} else {
			this.newGroupData.push(edition);
		}
		if (edition.hasOwnProperty('isSublayer')) {
			if (edition['isSublayer']) {
				this.setLayersAsSubLayer([edition]);
			} else {
				this.removeFromSublayers(edition.id)
			}
		}
		if (edition['subLayers'] && (edition['subLayers'].length > 0)) {
			this.setLayersAsSubLayer(edition['subLayers']);
		}
		if (edition.hasOwnProperty('isPrimary') && edition['isPrimary']) {
			this.setLayerAsPrimary(edition['id'])
		}
		this.edited = true;
	}

	setLayerAsPrimary(id) {
		const editedLayer = this.groupLayers.find(layer => layer.id === id);
		editedLayer['isPrimary'] = true;
		editedLayer['isSublayer'] = false;
		this.removeFromSublayers(id);
	}

	setLayersAsSubLayer(subLayers) {
		subLayers.forEach(subLayer => {
			const subLayerParams = {
				isSublayer: true, isPrimary: false, subLayers: null,
			}
			const editedLayer = this.groupLayers.find((layer) => layer.id === subLayer.id);
			if (editedLayer || !editedLayer['isSublayer']) {
				Object.assign(editedLayer, subLayerParams)
			};
			const newLayerData = this.newGroupData.find((layer) => layer.id === subLayer.id)
			if (newLayerData) {
				Object.assign(newLayerData, subLayerParams)
			} else {
				this.newGroupData.push({
					id: subLayer.id, ...subLayerParams
				})
			}
		})
	}

	removeFromSublayers(id) {
		this.groupLayers.filter(layer => layer.isPrimary && layer.subLayers)
			.forEach(primaryLayer => {
				const hasLayer = primaryLayer.subLayers.some(subLayer => subLayer.id === id)
				if (hasLayer) {
					primaryLayer.subLayers = primaryLayer
						.subLayers.filter(subLayer => subLayer.id !== id)
					const hasThisLayer = this.newGroupData
						.findIndex(subLayer => subLayer.id === primaryLayer.id)
					if (hasThisLayer >= 0) {
						this.newGroupData[hasThisLayer]['subLayers'] = primaryLayer.subLayers;
					} else {
						this.newGroupData.push({ id: primaryLayer.id, subLayers: primaryLayer.subLayers })
					}
				}
			});
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
	}
}
