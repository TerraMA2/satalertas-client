import { SettingsService } from 'src/app/services/settings.service';
import { Component, OnInit } from '@angular/core';
import {TreeNode, MessageService} from 'primeng-lts/api';
import { Evented } from 'leaflet';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css'],
  providers: [MessageService]
})

export class GroupListComponent implements OnInit {
  selectedGroups: TreeNode[];

  files: TreeNode[];

  cols: any[] = [];

  dialogVisible: boolean;


  constructor(
    private settingsService: SettingsService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.settingsService.getFiles().then(res => {
      this.files = res.data;
      this.cols = res.cols;
    });
  }

  groupSelect(event) {
    this.messageService.add({
      severity: 'info',
      summary: 'Grupo Selecionado',
      detail: event.node.data.name
    });
    console.log(this.selectedGroups);

  }
  
  groupUnSelect(event) {
    this.messageService.add({
      severity: 'info',
      summary: 'Node Unselected',
      detail: event.node.data.name
    });
    console.log(this.selectedGroups);
  }
}
