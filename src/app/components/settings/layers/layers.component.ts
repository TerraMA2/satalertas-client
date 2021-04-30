import {Component, OnInit} from '@angular/core';
import {SidebarService} from '../../../services/sidebar.service';
import {Location} from '@angular/common';

import {GroupViewService} from 'src/app/services/group-view.service';
import {GroupService} from 'src/app/services/group.service';
import {SelectItem} from 'primeng-lts/api';
import {Group} from '../../../models/group.model';
import {MessageService} from 'primeng-lts/api';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html'
})

export class LayersComponent implements OnInit {
  groups: SelectItem[];

  selectedGroup;
  availableLayers;
  selectedLayers;

  constructor(
    private sidebarService: SidebarService,
    private location: Location,
    private groupViewService: GroupViewService,
    private groupService: GroupService,
    private messageService: MessageService,
  ) { }

  async ngOnInit() {
    this.sidebarService.sidebarReload.next('settings');

    this.groups = await this.groupService.getAll().then((data) => {
      return data.map((group: Group) => ({label: group.name, value: group.id}));
    }).catch(() => []);
  }

  async onChangeOptionField(event){
    const group = event.value;

    if (group){
      this.selectedLayers = await this.groupViewService.getByGroupId(group.value).then((selectedGroupViews) => {
        if (selectedGroupViews && Array.isArray(selectedGroupViews) && selectedGroupViews.length > 0) {
          return selectedGroupViews.map((selectedGroupView) => ({id: selectedGroupView.id, id_group: selectedGroupView.id_group, name: selectedGroupView.view.name, id_view: selectedGroupView.id_view}));
        }
        return [];
      });
      this.availableLayers = await this.groupViewService.getAvailableLayers(group.value).then((availableGroupViews) => {
        if (availableGroupViews && Array.isArray(availableGroupViews) && availableGroupViews.length > 0) {
          return availableGroupViews.map((availableGroupView) => ({name: availableGroupView.name, id_view: availableGroupView.id}));
        }
        return [];
      });
    } else {
      this.selectedLayers = [];
      this.availableLayers = [];
    }
  }

  async update(){
    const layers = this.selectedLayers.map(layerId => ({id_group: this.selectedGroup.value, id_view: layerId.id_view}));
    await this.groupViewService.update({id_group: this.selectedGroup.value, layers});
    this.messageService.add({severity:'success', summary:'Sucesso', detail:'Camadas do grupo atualizadas'});
  }
}
