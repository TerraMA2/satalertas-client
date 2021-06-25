import { GroupService } from 'src/app/services/group.service';
import { GroupViewService } from './../../../services/group-view.service';
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
  ) { }

  async ngOnInit() {
    this.sidebarService.sidebarReload.next('settings');
    this.groups = await this.groupService.getAll().then((data) => {
      return data;
    })
  }

  joinSubLayerData(layers, subLayersIds) {
    return layers.filter(({id}) => subLayersIds.includes(id));
  }

  async getGroupData(groupId) {
    if (groupId) {
      await this.groupViewService.getByGroupId(groupId)
        .then((data) => {
          data.forEach((item) => {
            if (item.sub_layers) {
              item.sub_layers = this.joinSubLayerData(data, item.sub_layers);
            }
          })
          this.groupLayers = data;
        })
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
    `
    Sends the choosen layer to be edited at modal editor advanced.
    `
    this.layer = { ...layerToEdit };
    this.availableLayers = this.groupLayers.filter((item) => item.id_view !== layerToEdit.id_view);
    this.displayModal = true;
  };

  async cancelModalEdition() {
    this.displayModal = false;
    this.clearNewData();
  };

  async getModalEditions() {
    this.displayModal = false;
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
      message: "Deseja salvar todas as edições feitas no grupo?",
      header: "Atenção!",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        await this.groupViewService.updateAdvanced({ id_group: this.selectedGroup, editions: this.newGroupData })
        .then(() => {
          this.onGroupChange({value: this.selectedGroup});
          this.edited = false;
          this.messageService.add({
            severity: 'success',
            summary: "Sucesso",
            detail: "Edições Salvas",
            life: 3000
          })
        })
      }
    })
  }

  async cancelGroupEdition() {
    this.confirmationService.confirm({
      message: "Esta ação irá cancelar TODAS as edições feitas neste grupom, deseja continuar?",
      header: "Atenção!",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        await this.getGroupData(this.selectedGroup)
          .then(() => {
            this.clearNewData();
            this.edited = false;
            this.messageService.add({
              severity: 'success',
              summary: "Sucesso",
              detail: "Edições desfeitas",
              life: 3000
            })
          });
      }
    })
  }

  clearNewData() {
    this.newGroupData = [];
    this.layerEdition = {};
  }
}
