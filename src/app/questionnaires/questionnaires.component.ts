import { Component, OnInit } from '@angular/core';
import { QuestionnairesService } from '../_services/questionnaires.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { QuestionnaireAddEditComponent } from './questionnaire-add-edit/questionnaire-add-edit.component';
import { QuestionnaireShowComponent } from './questionnaire-show/questionnaire-show.component';

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

  constructor( private _questionnaireService: QuestionnairesService,
               private modalService: BsModalService ) { }

  ngOnInit() {
    this.getAllQuestionnaires();
  }

  getAllQuestionnaires() {
    this._questionnaireService.getAllQuestionnaires()
      .subscribe(data =>
        this.questionnaires = data, 
        error => this.errorMsg = error);
  }

  deleteQuestionnaire(questionnaire) {
    console.log("Delete Questionnaire");
    console.log(questionnaire);
  }

	// modal display

	addEditQuestionnaire(questionnaire) {
    const initialState = {
      questionnaire: (questionnaire) ? questionnaire : {}
    }    
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

}
