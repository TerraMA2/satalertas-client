import { SettingsService } from 'src/app/services/group.service';
import { Component, OnInit } from '@angular/core';
import {TreeNode, MessageService, ConfirmationService} from 'primeng-lts/api';
import { Group } from '../../../../models/groups.model';
import ConfigJson from 'src/assets/config.json';
@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class GroupListComponent implements OnInit {
  confButtons;
  idCompany;
  groups: Group[] = [];
  confModalButtons;
  lines = [];
  selectedGroups: TreeNode[];
  files: any[];
  cols = ConfigJson.settings.groupsColumns;
  dialogVisible: boolean;
  inputs = [];
  submitted: boolean;
  group: Group = {};

  constructor(
    private settingsService: SettingsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  async ngOnInit() {
    await this.settingsService.getAllGroups().then(res => {
      this.groups = res;
      for (let field of this.cols) {
        const fiel = {
          show: true,
          disable: false,
          label: `${field.header}`,
          inputClass: 'input-group',
          type: 'text',
          // model: '',
          onChange: (event) => { console.log(event)},
          field: `${field.field}`,
          required: true
        };
        this.inputs.push(fiel);
      };
      this.lines = [
        { show: true,
          label: '',
          inputs: [...this.inputs]}
      ];
    });
  }

  startNewGroup() {
    this.group = {};
    this.submitted = false;
    this.dialogVisible = true;
  }

  cancelNewGroup() {
    this.dialogVisible = false;
    this.submitted = false;
  }

  editGroup(editedGroup: Group) {
    this.group = { ...editedGroup };
    this.dialogVisible = true;
  }

  async removeGroup(deletedGroup: Group) {
    this.confirmationService.confirm({
      message: `Deseja deletar o grupo ${deletedGroup.name}?`,
      header: "Atenção!",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.settingsService.removeGroup(deletedGroup.id)
        .then(() => {
          const groupPos = this.groups
          .findIndex(item => item.id === deletedGroup.id);
          this.groups.splice(groupPos, 1);
        });
        this.messageService.add({
          severity: 'success',
          summary: "Sucesso",
          detail: "Grupo deletado",
          life: 3000
        });
      }
    });
  }

  async closeModalDialog() {
    this.dialogVisible = false;
    if (this.group.id) {
      await this.settingsService.editGroup(this.group)
        .then(response => {
          const groupPos = this.groups
          .findIndex(item => item.id === this.group.id);
          this.groups.splice(groupPos, 1, response);
        });  
    } else {
      await this.settingsService.createNewGroup(this.group)
      .then(response => {
          this.groups.push(response);
      });
    }
    this.messageService.add({
      severity: 'success',
      summary: "Sucesso",
      detail: "Grupo salvo",
      life: 3000
    });
    this.group = {};
  }
}
