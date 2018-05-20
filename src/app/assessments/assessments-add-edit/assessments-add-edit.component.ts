import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { QuestionnaireShowComponent } from '../../questionnaires/questionnaire-show/questionnaire-show.component';
import { AssessmentsService } from '../../_services/assessments.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-assessments-add-edit',
  templateUrl: './assessments-add-edit.component.html',
  styleUrls: ['./assessments-add-edit.component.scss']
})
export class AssessmentsAddEditComponent implements OnInit {
  errorMsg: any;
  isEdit: boolean = false;
  btnSubmitName: string = "Save";
  assessmentAddEditModal: BsModalRef;
  assessmentData: any = {};
  questionnaires: any;
  minDeadline: Date;
  
  constructor(public bsModalRef: BsModalRef,
              private modalService: BsModalService,
              private alertify: AlertifyService,
              private _assessmentsService: AssessmentsService) { }

  ngOnInit() {
    if(this.assessmentData){
      this.isEdit = true;
      this.btnSubmitName = 'Update';
    } else {
      this.assessmentData = {};
    }

    this.getQuestionnairesList(); 
    this.minDeadline = new Date();
  }

  // MAIN FUNCTIONS

  submitAssessment() {
    console.log(this.assessmentData);

    if (this.isEdit) {
      this.updateAssessment();
    } else {
      this.saveAssessment();
    }
  }

  // API METHODS

  /* Purpose: Save new assessment */
  saveAssessment() {
    let response: any;

    this._assessmentsService.saveAssessment(this.assessmentData)
      .subscribe(
        data => response = data,
        error => this.errorMsg = error,
        () => { 
          if (response) {
            this.alertify.success('Assessment saved successfully!');
          } else {
            this.alertify.error('Saving assessment - failed!');
          }

          this.bsModalRef.hide();
        }
      );
  }

  /* Purpose: Update assessment */
  updateAssessment() {
    let response: any;

    this._assessmentsService.updateAssessment(this.assessmentData)
      .subscribe(
        data => response = data,
        error => this.errorMsg = error,
        () => { 
          if (response) {
            this.alertify.success('Assessment - successfully updated!');
          } else {
            this.alertify.error('Updating assessment - failed!');
          }
          this.bsModalRef.hide();
        }
      );
  }

  // API GET

  getQuestionnairesList() {
    this._assessmentsService.getQuestionnairesList()
            .subscribe(data =>
            this.questionnaires = data,
            error => this.errorMsg = error);
  }

  // modal display

  showQuestionnaire(questionnaire) {
    this.assessmentData.questionaireId = questionnaire.questionaireId;

    const initialState = {
      questionnaire: questionnaire
    }    
    this.assessmentAddEditModal = this.modalService.show(
      QuestionnaireShowComponent, 
      Object.assign({initialState}, { class: 'modal-lg' })
    );
  }

}
