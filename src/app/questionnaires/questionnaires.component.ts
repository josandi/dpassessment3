import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { QuestionnairesService } from '../_services/questionnaires.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { QuestionnaireAddEditComponent } from './questionnaire-add-edit/questionnaire-add-edit.component';
import { QuestionnaireShowComponent } from './questionnaire-show/questionnaire-show.component';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Questionnaire } from '../_models/questionnaire';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-questionnaires',
  templateUrl: './questionnaires.component.html',
  styleUrls: ['./questionnaires.component.scss']
})
export class QuestionnairesComponent implements OnInit {
  questionnaireShowModal: BsModalRef;
  questionnaireAddEditModal: BsModalRef;
  errorMsg;
  questionnaires: Questionnaire[];
  pagination: Pagination;
  questionnaire: any = {};
  bsModalRef: BsModalRef;
  subscriptions: Subscription[] =[];

  constructor(private _questionnaireService: QuestionnairesService,
              private route: ActivatedRoute,
              private alertify: AlertifyService,
              private modalService: BsModalService,
              private changeDetection: ChangeDetectorRef ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.questionnaires = data['questionnaires'].result;
      this.pagination = data['questionnaires'].pagination;
    });
  }

	// MAIN FUNCTIONS

  /* Purpose: get all questionnaires */
  loadQuestionnaires() {
    this._questionnaireService.getAllQuestionnaires(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe((res: PaginatedResult<Questionnaire[]>) => {
        this.questionnaires = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }

	// MODAL DISPLAY

  /* Purpose: show modal for adding or editing a questionnaire */
	addEditQuestionnaire(questionnaire) {
    const initialState = {
      questionnaire: (questionnaire) ? questionnaire : {}
    }
    this.subscribeModal();
    this.questionnaireAddEditModal = this.modalService.show(
      QuestionnaireAddEditComponent, 
      Object.assign(
        {initialState}, 
        {
          class: 'modal-lg',
          keyboard: false,
          ignoreBackdropClick: true
        }
      )
    );
	}

  /* Purpose: show modal for the selected questionnaire */
  showQuestionnaire(questionnaire) {
    const initialState = {
      questionnaire: questionnaire
    }    
    this.questionnaireShowModal = this.modalService.show(
      QuestionnaireShowComponent, 
      Object.assign({initialState}, { class: 'modal-lg' })
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
        this.loadQuestionnaires();                            // get updated questionnaires from db
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
  
  // UTILITIES

  /* Purpose: retrieve next set of data based on the pagination */
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadQuestionnaires();
  }

}
