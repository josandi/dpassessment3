import { Component, OnInit } from '@angular/core';
import { QuestionnairesService } from '../_services/questionnaires.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { QuestionnaireAddEditComponent } from './questionnaire-add-edit/questionnaire-add-edit.component';

@Component({
  selector: 'app-questionnaires',
  templateUrl: './questionnaires.component.html',
  styleUrls: ['./questionnaires.component.scss']
})
export class QuestionnairesComponent implements OnInit {
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

  showQuestionnaire(questionnaire) {
    console.log("Show Questionnaire");
    console.log(questionnaire);
  }

  editQuestionnaire(questionnaire) {
    console.log("Edit Questionnaire");
    console.log(questionnaire);
  }

  deleteQuestionnaire(questionnaire) {
    console.log("Delete Questionnaire");
    console.log(questionnaire);
  }

	// modal display

	addQuestionnaire() {
    this.bsModalRef = this.modalService.show(QuestionnaireAddEditComponent, 
      {class: 'modal-lg'});
    this.bsModalRef.content.closeBtnName = 'Close';
	}

}
