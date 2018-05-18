import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { QuestionnaireShowComponent } from '../../questionnaires/questionnaire-show/questionnaire-show.component';
import { AssessmentsService } from '../../_services/assessments.service';

@Component({
  selector: 'app-assessments-add-edit',
  templateUrl: './assessments-add-edit.component.html',
  styleUrls: ['./assessments-add-edit.component.scss']
})
export class AssessmentsAddEditComponent implements OnInit {
  errorMsg: any;
  assessmentAddEditModal: BsModalRef;
  assessmentData: any;
  questionnaires: any;
  minDeadline: Date;
  
  constructor(public bsModalRef: BsModalRef,
              private modalService: BsModalService,
              private _assessmentsService: AssessmentsService) { }

  ngOnInit() {
    if(!this.assessmentData){
      this.assessmentData = {};
      this.getQuestionnairesList(); 
    }

    this.minDeadline = new Date();
  }

  saveAssessment() {
    console.log("Save clicked");
    console.log(this.assessmentData);
    this.bsModalRef.hide();
  }

  // api get

  getQuestionnairesList() {
    this._assessmentsService.getQuestionnairesList()
            .subscribe(data =>
            this.questionnaires = data,
            error => this.errorMsg = error);
  }

  // modal display

  showQuestionnaire(questionnaire) {
    this.assessmentData.questionnaire_id = questionnaire.questionnaire_id;

    const initialState = {
      questionnaire: questionnaire
    }    
    this.assessmentAddEditModal = this.modalService.show(
      QuestionnaireShowComponent, 
      Object.assign({initialState}, { class: 'modal-lg' })
    );
  }

}
