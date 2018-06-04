import { Component, OnInit } from '@angular/core';
import { Team } from '../../_models/team';
import { TeamsService } from '../../_services/teams.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EmployeesService } from '../../_services/employees.service';

@Component({
  selector: 'app-team-show',
  templateUrl: './team-show.component.html',
  styleUrls: ['./team-show.component.scss']
})
export class TeamShowComponent implements OnInit {
  errorMsg: any = {};
  team: Team;
  members: any = [];
  teamAssessments: any = [];

  constructor(private _teamsService: TeamsService,
              private bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.getTeamMembers();
    this.getTeamAssessments();
  }

  // MAIN FUNCTIONS
  
  /* Purpose: close current modal */
  getTeamMembers() {
    this._teamsService.getTeamMembers(this.team.teamId)
      .subscribe(data => 
        this.members = data,
        error => this.errorMsg = error
      )
  }
  
  /* Purpose: close current modal */
  getTeamAssessments() {
    this._teamsService.getTeamAssessments(this.team.teamId)
      .subscribe(data => 
        this.teamAssessments = data,
        error => this.errorMsg = error
      )
  }

  // UTILITIES

  /* Purpose: close current modal */
  closeModal() {
    this.bsModalRef.hide();
  }

}
