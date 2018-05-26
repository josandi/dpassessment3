import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { QuestionnaireShowComponent } from '../../questionnaires/questionnaire-show/questionnaire-show.component';
import { AssessmentsService } from '../../_services/assessments.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-assessment-add-edit',
  templateUrl: './assessment-add-edit.component.html',
  styleUrls: ['./assessment-add-edit.component.scss']
})
export class AssessmentAddEditComponent implements OnInit {
  errorMsg: any;
  isEdit: boolean = false;
  btnSubmitName: string = "Save";
  assessmentAddEditModal: BsModalRef;
  assessmentData: any = {};
  questionnaires: any;
  minDeadline: Date;
  
  constructor(private bsModalRef: BsModalRef,
              private modalService: BsModalService,
              private alertify: AlertifyService,
              private _assessmentsService: AssessmentsService) { }

  ngOnInit() {
    if(this.assessmentData){          // check type of operation
      this.isEdit = true;
      this.btnSubmitName = 'Update';
    } else {
      this.assessmentData = {};
    }

    this.getQuestionnairesList(); 
    this.minDeadline = new Date();    // to restrict deadline dtp selection
  }

  // MAIN FUNCTIONS

  /* Purpose: get questionnaires to display a selection when creating an assessment */
  getQuestionnairesList() {
    this._assessmentsService.getQuestionnairesList()
      .subscribe(data =>
      this.questionnaires = data,
      error => this.errorMsg = error);
  }

  /* Purpose: called when form is submitted */
  submitAssessment() {
    if (this.isEdit) {
      this.updateAssessment();
    } else {
      this.saveAssessment();
    }
  }

  /* Purpose: save new assessment */
  saveAssessment() {
    let response: any;

    this._assessmentsService.saveAssessment(this.assessmentData)
      .subscribe(
        data => response = data,
        error => this.alertify.error('Saving assessment - failed!'),
        () => { 
          if (response) {
            this.alertify.success('Assessment saved successfully!');
          }
          this.closeModal();
        }
      );
  }

  /* Purpose: update assessment */
  updateAssessment() {
    let response: any;

    this._assessmentsService.updateAssessment(this.assessmentData)
      .subscribe(
        data => response = data,
        error => this.alertify.error('Updating assessment - failed!'),
        () => { 
          if (response) {
            this.alertify.success('Assessment - successfully updated!');
          }
          this.closeModal();
        }
      );
  }

  // MODAL DISPLAY

  /* Purpose: shows questionnaire */
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

  /* Purpose: hides current modal */
  closeModal() {
    this.bsModalRef.hide();
  }

}
