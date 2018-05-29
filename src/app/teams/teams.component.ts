import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Team } from '../_models/team';
import { Pagination } from '../_models/pagination';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  teams: Team[];
  pagination: Pagination;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.teams = data['teams'].result;
      this.pagination = data['teams'].pagination;
    });
  }

  // MAIN FUNCTIONALITIES

  showAddEdit(team) {
    console.log('showAddEdit: ' + team);
  }

}
