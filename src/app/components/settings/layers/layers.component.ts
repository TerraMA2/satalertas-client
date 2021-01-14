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
    
    this.groups = await this.groupService.getAll().then((data) => {
      return data.map((group) => ({label: group.name, value: group.id}));
    }).catch(() => []);
  }

  backClicked() {
    this.location.back();
    this.sidebarService.sidebarReload.next();
  }

  async onChangeOptionField(event){
    var group = event.value;

    if (group){
      this.selectedLayers = await this.groupViewService.getByGroupId(group.value).then((selectedGroupViews) => {
        return selectedGroupViews.map((selectedGroupView) => ({name: selectedGroupView.view.name}));
      });
      this.availableLayers = await this.groupViewService.getAvailableLayers(group.value).then((availableGroupViews) => {
        return availableGroupViews.map((availableGroupView) => ({name: availableGroupView.view.name}));
      });
    } else {
      this.selectedLayers = [];
      this.availableLayers = [];
    }
  }
}