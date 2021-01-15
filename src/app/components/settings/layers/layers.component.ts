import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../../services/sidebar.service';
import { Location } from '@angular/common';

import { GroupViewService } from 'src/app/services/group-view.service';
import { GroupService } from 'src/app/services/group.service';
import { SelectItem } from "primeng-lts/api";

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.css']
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
  ) { }

  async ngOnInit() {
    this.sidebarService.sidebarReload.next('settings');
    
    this.groups = await this.groupService.getAllGroups().then((data) => {
      return data.map((group) => ({label: group.name, value: group.id}));
    }).catch(() => []);
  }

  async onChangeOptionField(event){
    const group = event.value;
   
    if (group){
      this.selectedLayers = await this.groupViewService.getByGroupId(group.value).then((selectedGroupViews) => {
        return selectedGroupViews.map((selectedGroupView) => ({id: selectedGroupView.id, id_group: selectedGroupView.id_group, name: selectedGroupView.view.name, id_view: selectedGroupView.id_view}));
      });
      this.availableLayers = await this.groupViewService.getAvailableLayers(group.value).then((availableGroupViews) => {
        return availableGroupViews.map((availableGroupView) => ({name: availableGroupView.view.name, id_view: availableGroupView.id_view}));
      });
    } else {
      this.selectedLayers = [];
      this.availableLayers = [];
    }
  }

  // selectedGroup.value = id do grupo
  
  async update(){
    this.groupViewService.update({id_group: this.selectedGroup.value, layers: this.selectedLayers});
  }

  backClicked() {
    this.location.back();
    this.sidebarService.sidebarReload.next();
  }
}