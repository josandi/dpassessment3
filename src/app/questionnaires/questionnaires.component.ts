import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { QuestionnairesService } from '../_services/questionnaires.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { QuestionnaireAddEditComponent } from './questionnaire-add-edit/questionnaire-add-edit.component';
import { QuestionnaireShowComponent } from './questionnaire-show/questionnaire-show.component';
import { Observable, Subscription } from 'rxjs';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-questionnaires',
  templateUrl: './questionnaires.component.html',
  styleUrls: ['./questionnaires.component.scss']
})
export class QuestionnairesComponent implements OnInit {
  questionnaireShowModal: BsModalRef;
  questionnaireAddEditModal: BsModalRef;
  errorMsg;
  questionnaires: any;
  questionnaire: any = {};
  bsModalRef: BsModalRef;
  subscriptions: Subscription[] =[];

  constructor(private _questionnaireService: QuestionnairesService,
              private modalService: BsModalService,
              private changeDetection: ChangeDetectorRef ) { }

  ngOnInit() {
    this.getAllQuestionnaires();
  }

  getAllQuestionnaires() {
    this._questionnaireService.getAllQuestionnaires()
      .subscribe(data =>
        this.questionnaires = data, 
        error => this.errorMsg = error);
  }

	// MODAL DISPLAY

	addEditQuestionnaire(questionnaire) {
    const initialState = {
      questionnaire: (questionnaire) ? questionnaire : {}
    }
    this.subscribeModal();
    this.questionnaireAddEditModal = this.modalService.show(
      QuestionnaireAddEditComponent, 
      Object.assign({initialState}, { class: 'modal-lg' })
    );
	}

  showQuestionnaire(questionnaire) {
    const initialState = {
      questionnaire: questionnaire
    }    
    this.questionnaireShowModal = this.modalService.show(
      QuestionnaireShowComponent, 
      Object.assign({initialState}, { class: 'modal-lg' })
    );
  }

  subscribeModal() {
    const _combine = combineLatest(Observable,
      this.modalService.onHide, 
      this.modalService.onHidden
    ).subscribe(() => this.changeDetection.markForCheck());

    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        this._questionnaireService.getAllQuestionnaires()
          .subscribe(data =>
            this.questionnaires = data, 
            error => this.errorMsg = error);
      })
    );

    this.subscriptions.push(
      this.modalService.onHidden.subscribe((reason: string) => {
        this.unsubscribeModal();
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
