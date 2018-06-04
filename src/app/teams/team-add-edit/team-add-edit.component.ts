import { Component, OnInit } from '@angular/core';
import { Team } from '../../_models/team';
import { TeamsService } from '../../_services/teams.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { AlertifyService } from '../../_services/alertify.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ClientsService } from '../../_services/clients.service';
import { EmployeesService } from '../../_services/employees.service';

@Component({
  selector: 'app-team-add-edit',
  templateUrl: './team-add-edit.component.html',
  styleUrls: ['./team-add-edit.component.scss']
})
export class TeamAddEditComponent implements OnInit {
  errorMsg: any = {};
  team: Team;
  formattedTeam: any = {};
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
              private employeesService: EmployeesService,
              private clientsService: ClientsService,
              private alertify: AlertifyService,
              private bsModalRef: BsModalRef) { }

  ngOnInit() {
    if(Object.keys(this.team).length !== 0) {
      this.isEdit = true;
      this.btnSubmitName = 'Update';
      this.getTeamMembers();
    }

    this.getClientsList();            // prepare values for dropdowns
    this.getEmployeesList();
    this.getProjectsList();
    this.getEmpRolesList();
  }

  // MAIN FUNCTIONS

  /* Purpose: submit team */
  submitTeam() {
    this.team.clientId = this.selectedClient.clientId;
    this.formatTeamToAdd();

    if(!this.isEdit) {
      this.saveNewTeam();
    } else {
      this.updateTeam();
    }
  }

  /* Purpose: add employee to member list  */
  addMember() {
    const addMember = {...this.newMember};

    if(this.memberAlreadyAdded(addMember.aspNetUserId)){
      this.alertify.error('Employee already added to members list!');
    } else {
      this.members.push({
        'aspNetUserId': this.newMember.aspNetUserId,
        'empFullName': this.newMember.fullName,
        'teamRoleId': this.newMember.role.teamRoleId,
        'teamRoleName': this.newMember.role.teamRoleName
      });
    }
    this.newMember.fullName = null;
    this.canAddMember = false;    
  }

  /* Purpose: remove employee from member list */
  removeMember(member) {
    let member_idx = this.members.indexOf(member);
    this.members.splice(member_idx, 1);
  }

  /* Purpose: save new team */
  saveNewTeam() {
    let response: any;

    this._teamsService.saveNewTeam(this.formattedTeam, this.isNewProject)
      .subscribe(
        data => response = data,
        error => this.alertify.error('Saving new team - failed!'),
        () => {
          if(response) {
            this.alertify.success('New Team saved successfully!');
          }
          this.closeModal();
        }
      );
  }

  /* Purpose: update existing team */
  updateTeam() {
    let response: any;

    this._teamsService.updateTeam(this.formattedTeam)
      .subscribe(
        data => response = data,
        error => this.alertify.error('Updating team - failed!'),
        () => {
          if(response) {
            this.alertify.success('New Team updated successfully!');
          }
          this.closeModal();
        }
      );
  }

  // PREPARE DATA FROM DATABASE
  
  /* Purpose: retrieve clients list for the dropdown */
  getClientsList() {
    this.clientsService.getClientsList()
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
    this.employeesService.getEmployeesList()
      .subscribe(data =>
        this.employees = data, 
        error => this.errorMsg = error
      );
  }

  /* Purpose: retrieve list of all projects for the auto complete */
  getProjectsList() {
    this._teamsService.getProjects()
      .subscribe(data =>
        this.projects = data, 
        error => this.errorMsg = error
      );
  }

  /* Purpose: retrieve roles list for the dropdown */
  getEmpRolesList() {
    this._teamsService.getEmpRoleList()
      .subscribe(data =>
        this.roles = data, 
        error => this.errorMsg = error,
        () => {
          this.newMember.role = this.roles[0];
        }
      );
  }

  /* Purpose: get members of specific team */
  getTeamMembers() {
    this._teamsService.getTeamMembers(this.team.teamId)
      .subscribe(data =>
        this.members = data, 
        error => this.errorMsg = error
      );
  }

  // UTILITIES

  /* Purpose: only allow adding of new member if an employee is selected from the list */
  onMemberSelect(event: TypeaheadMatch): void {
    this.newMember.aspNetUserId = event.item.aspNetUserId;
    this.canAddMember = true;
  }

  onProjectSelect(event: TypeaheadMatch): void {
    this.isNewProject = false;
    this.team.projectId = event.item.projectId;
    this.team.projectDesc = event.item.projectDesc;
    
    this.selectedClient.clientId = event.item.clientId;
    this.selectedClient.clientFullName = event.item.clientFullName;
  }

  /* Purpose: Clear fields when check box for new project is changed */
  onNewProjectCheckChange() {
    this.isNewProject = !this.isNewProject;
    this.clearProjectRelatedFields();
  }

  /* Purpose: clear fields if project does not exist and is not a new project */
  projectNoResult(event: boolean): void {
    if (!this.isNewProject && event) {
      this.alertify.error('Project not existing. Check New Project to add a new one.');
      this.clearProjectRelatedFields();
    } 
  }

  /* Purpose: check if employee already added in the members list */
  memberAlreadyAdded(employeeId) {
    let member = this.members.find(x => x.aspNetUserId == employeeId);
    return (member) ? true : false;
  }

  /* Purpose: clear fields related to a project */
  clearProjectRelatedFields() {
    this.team.projectName = null;
    this.team.projectDesc= null;
    this.selectedClient = this.clients[0];
  }

  /* Purpose: format data to be submitted */
  formatTeamToAdd() {
    let project: any = {};
    let team: any = {};
    let members: any = [];

    project.projectId = this.team.projectId       //projectForCreateEdit
    project.clientId = this.team.clientId;
    project.projectName = this.team.projectName;
    project.projectDesc = this.team.projectDesc;
    team.teamId = this.team.teamId;               //projectTeamForCreateEdit
    team.projectId = this.team.projectId;
    team.teamName = this.team.teamName;
    team.teamDesc = this.team.teamDesc;
    this.members.forEach(member => {              //projectTeamMembersForCreateEdit
      members.push({
        'aspNetUserId': member.aspNetUserId,
        'teamRoleId': member.teamRoleId
      })
    });

    if (!this.isEdit) {                           //append to property based on the operation
      if(this.isNewProject){                      //  -add: with new project
        this.formattedTeam.projectForCreate = project; 
      } else {                                    //  -add: existing project
        this.formattedTeam.projectId = project.projectId;
      }       
      this.formattedTeam.projectTeamForCreate = team;
      this.formattedTeam.projectTeamMembersForCreate = members;
    } else {                                      //  -edit
      this.formattedTeam.projectForEdit = project;
      this.formattedTeam.projectTeamForEdit = team;
      this.formattedTeam.projectTeamMembersForEdit = members;
    }
  }

  /* Purpose: hide current modal */
  closeModal() {
    this.bsModalRef.hide();
  }

}
