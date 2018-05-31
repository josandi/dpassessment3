import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { QuestionnaireShowComponent } from '../../questionnaires/questionnaire-show/questionnaire-show.component';
import { AssessmentsService } from '../../_services/assessments.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ClientsService } from '../../_services/clients.service';
import { TeamsService } from '../../_services/teams.service';

@Component({
  selector: 'app-assessment-add-edit',
  templateUrl: './assessment-add-edit.component.html',
  styleUrls: ['./assessment-add-edit.component.scss']
})
export class AssessmentAddEditComponent implements OnInit {
  errorMsg: any;
  isEdit: boolean = false;
  btnSubmitName: string = 'Save';
  assessmentAddEditModal: BsModalRef;
  assessmentData: any = {};
  questionnaires: any;
  assessmentFor: string = 'employee';
  minDeadline: Date;
  clientsList: any = {};
  teamsList: any = {};
  
  constructor(private _assessmentsService: AssessmentsService,
              private clientsService: ClientsService,
              private teamsService: TeamsService,
              private bsModalRef: BsModalRef,
              private modalService: BsModalService,
              private alertify: AlertifyService) { }

  ngOnInit() {
    if(this.assessmentData){          // check type of operation
      this.isEdit = true;
      this.btnSubmitName = 'Update';
    } else {
      this.assessmentData = {};
    }

    this.getQuestionnairesList();
    this.getClientsList();
    this.getTeamsList();
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

  // PREPARE DATA FROM API

  /* Purpose: get list of clients for dropdown */
  getClientsList() {
    this.clientsService.getClientsList()
      .subscribe(data =>
        this.clientsList = data,
        error => this.errorMsg = error);
  }

  /* Purpose: get list of teams for dropdown */
  getTeamsList() {
    this.teamsService.getTeamsList()
      .subscribe(data =>
        this.teamsList = data,
        error => this.errorMsg = error);
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
