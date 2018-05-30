import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Team } from '../_models/team';
import { Pagination } from '../_models/pagination';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TeamAddEditComponent } from './team-add-edit/team-add-edit.component';
import { TeamShowComponent } from './team-show/team-show.component';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  teams: Team[];
  pagination: Pagination;
  subscriptions: Subscription[] = [];
  teamShowModal: BsModalRef;
  teamAddEditModal: BsModalRef;

  constructor(private route: ActivatedRoute,
              private modalService: BsModalService,
              private changeDetection: ChangeDetectorRef) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.teams = data['teams'].result;
      this.pagination = data['teams'].pagination;
    });
  }

  // MAIN FUNCTIONALITIES

  /* Purpose: display team details */
  showTeam(team) {
    const initialState = {
      team: team
    }

    this.teamShowModal = this.modalService.show(
      TeamShowComponent,
      Object.assign(
        {initialState},
        {
          class: 'modal-md',
          keyboard: false,
          ignoreBackdropClick: true
        }
      )
    );
  }

  /* Purpose: show modal for adding/editing teams */
  showAddEdit(team) {
    const initialState = {
      team: (team) ? team : {}
    }
    this.subscribeModal();
    this.teamAddEditModal = this.modalService.show(
      TeamAddEditComponent,
      Object.assign(
        {initialState},
        {
          class: 'modal-md',
          keyboard: false,
          ignoreBackdropClick: true
        }
      )
    );
  }

  // MODAL UTILS

  /* Purpose: Refresh list after add and update */
  subscribeModal() {
    const _combine = combineLatest(Observable, 
      this.modalService.onHide,
      this.modalService.onHidden
    ).subscribe(() => this.changeDetection.markForCheck());
    
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        // this.loadQuestionnaires();                            // get updated questionnaires from db
      })
    );

    this.subscriptions.push(
      this.modalService.onHidden.subscribe((reason: string) => {
        this.unsubscribeModal();                                // unsubscribe after modal is hidden
      })
    )

    this.subscriptions.push(_combine);
  }

  unsubscribeModal() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

}
