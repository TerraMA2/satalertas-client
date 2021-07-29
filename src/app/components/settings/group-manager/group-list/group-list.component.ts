import {GroupService} from 'src/app/services/group.service';
import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService, TreeNode} from 'primeng/api';
import {Group} from '../../../../models/group.model';
import {ConfigService} from '../../../../services/config.service';

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
  cols;
  dialogVisible: boolean;
  inputs = [];
  submitted: boolean;
  group: Group = {};

  constructor(
    private groupService: GroupService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private configService: ConfigService
  ) { }

  async ngOnInit() {
    this.cols = this.configService.getSettingsConfig('groupsColumns')
    await this.groupService.getAll().then(res => {
      if (res.length > 0) {
        this.groups = res;
      }
      for (const field of this.cols) {
        const fiel = {
          show: true,
          disable: false,
          label: `${field.header}`,
          inputClass: 'input-group',
          type: field.type,
          // model: '',
          onChange: (event) => { },
          field: `${field.field}`,
          required: true
        };
        this.inputs.push(fiel);
      }
      this.lines = [
        {
          show: true,
          label: '',
          inputs: [...this.inputs]
        }
      ];
    });
  }

  async getAllGroups() {
    await this.groupService.getAll().then(res => {
      if (res.length > 0) {
        this.groups = res;
      }
    })
  }

  startNewGroup() {
    this.group = {};
    this.submitted = false;
    this.dialogVisible = true;
  }

  cancelGroupEdition() {
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
      header: 'Atenção!',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.groupService.removeGroup(deletedGroup.id)
        .then(() => {
          this.getAllGroups();
        })
        .then(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Grupo deletado',
            life: 3000
          });
        });
      }
    });
  }

  async saveGroup() {
    this.dialogVisible = false;
    if (this.group.id) {
      await this.groupService.editGroup(this.group)
        .then(() => {
          this.getAllGroups();
        });
    } else {
      await this.groupService.createNewGroup(this.group)
        .then(() => {
          this.getAllGroups();
        });
    }
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Grupo salvo',
      life: 3000
    });
    this.group = {};
  }
}
