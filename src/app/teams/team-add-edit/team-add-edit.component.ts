import { Component, OnInit } from '@angular/core';
import { Team } from '../../_models/team';
import { TeamsService } from '../../_services/teams.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { AlertifyService } from '../../_services/alertify.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-team-add-edit',
  templateUrl: './team-add-edit.component.html',
  styleUrls: ['./team-add-edit.component.scss']
})
export class TeamAddEditComponent implements OnInit {
  errorMsg: any = {};
  team: Team;
  clients: any;
  employees: any;
  projects: any;
  roles: any;
  newMember: any = {};
  members: any = [];
  selectedClient: any = {};
  btnSubmitName: string = 'Save';
  isEdit: boolean = false;
  isNewProject: boolean = false;
  canAddMember: boolean = false;

  constructor(private _teamsService: TeamsService,
              private alertify: AlertifyService,
              private bsModalRef: BsModalRef) { }

  ngOnInit() {
    if(this.team) {
      this.isEdit = true;
      this.btnSubmitName = 'Update';
    }

    this.getClientsList();
    this.getEmployeesList();
    this.getEmpRolesList();
  }

  // MAIN FUNCTIONS 
  submitTeam() {
    // set selected client
    this.team.clientId = this.selectedClient.clientId;
    
    console.log(this.team);
    console.log(this.members);

    this.closeModal();
    this.alertify.success('Team successfully added!');
  }

  addMember() {
    const addMember = {...this.newMember};

    if(this.memberAlreadyAdded(addMember.aspNetUserID)){
      this.alertify.error('Employee already added to members list!');
    } else {
      this.members.push(addMember);
    }
    this.newMember.fullName = null;
    this.canAddMember = false;
  }

  removeMember(member) {
    let member_idx = this.members.indexOf(member);
    this.members.splice(member_idx, 1);
  }

  // PREPARE DATA FROM DATABASE
  
  /* Purpose: retrieve clients list for the dropdown */
  getClientsList() {
    this._teamsService.getClientsList()
      .subscribe(data =>
        this.clients = data, 
        error => this.errorMsg = error,
        () => {
          this.selectedClient = this.clients[0];
        }
      );
  }

  /* Purpose: retrieve employees list for the auto complete field */
  getEmployeesList() {
    this._teamsService.getEmployeesList()
      .subscribe(data =>
        this.employees = data, 
        error => this.errorMsg = error
      );
  }

  /* Purpose: retrieve roles list for the dropdown */
  getProjectsList() {
    this._teamsService.getEmpRolesList()
      .subscribe(data =>
        this.projects = data, 
        error => this.errorMsg = error,
        () => {
          console.log(this.roles)
        }
      );
  }

  /* Purpose: retrieve roles list for the dropdown */
  getEmpRolesList() {
    this._teamsService.getEmpRolesList()
      .subscribe(data =>
        this.roles = data, 
        error => this.errorMsg = error,
        () => {
          this.newMember.role = this.roles[0];
        }
      );
  }

  // UTILITIES

  /* Purpose: only allow adding of new member if an employee is selected from the list */
  onMemberSelect(event: TypeaheadMatch): void {
    this.newMember.aspNetUserID = event.item.aspNetUserID;
    this.canAddMember = true;
  }

  /* Purpose: check if employee already added in the members list */
  memberAlreadyAdded(employeeId) {
    let member = this.members.find(x => x.aspNetUserID == employeeId);
    return (member) ? true : false;
  }

  /* Purpose: hide current modal */
  closeModal() {
    this.bsModalRef.hide();
  }

}
