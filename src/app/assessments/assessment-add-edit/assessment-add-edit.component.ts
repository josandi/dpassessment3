import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { QuestionnaireShowComponent } from '../../questionnaires/questionnaire-show/questionnaire-show.component';
import { AssessmentsService } from '../../_services/assessments.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ClientsService } from '../../_services/clients.service';
import { TeamsService } from '../../_services/teams.service';
import { Assessment } from '../../_models/assessment';
import { AssessmentOpts } from '../../_config/constants.config'

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
  assessmentData: Assessment;                   // sent from the main page
  assessment: any = {};                         // set current model
  questionnaires: any;
  minDeadline: Date;
  clientsList: any = [];
  teamsList: any = [];
  selectedTeam: any;
  selectedClient: any;
  readonly AssessmentOpts = AssessmentOpts;     // constant values for assessment options
  
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
      this.getAssessmentDetail();
    } else {
      this.isEdit = false;
      this.assessment = {};
      this.getDropdownLists();
    }

    this.getQuestionnairesList();
    this.minDeadline = new Date();    // to restrict deadline dtp selection
  }

  // MAIN FUNCTIONS

  /* Purpose: get assessment details */
  getAssessmentDetail() {
    this._assessmentsService.getAssessmentDetail(this.assessmentData.assessmentId)
      .subscribe(data => 
        this.assessment = data,
        error => this.errorMsg = error,
        () => {
          this.getDropdownLists();
        }
      );
  }

  /* Purpose: called when form is submitted */
  submitAssessment() {
    this.appendAssessmentOptionValues();
    (this.isEdit) ? this.updateAssessment() : this.saveAssessment();
  }

  /* Purpose: save new assessment */
  saveAssessment() {
    let response: any;
    console.log(this.assessment);

    this._assessmentsService.saveAssessment(this.assessment)
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
    console.log(this.assessment);

    this._assessmentsService.updateAssessment(this.assessment)
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

  /* Purpose: get questionnaires to display a selection when creating an assessment */
  getQuestionnairesList() {
    this._assessmentsService.getQuestionnairesList()
      .subscribe(data =>
      this.questionnaires = data,
      error => this.errorMsg = error);
  }

  getDropdownLists() {
    this.getClientsList();
    this.getTeamsList();
  }

  /* Purpose: get list of clients for dropdown */
  getClientsList() {
    this.clientsService.getClientsList()
      .subscribe(data =>
        this.clientsList = data,
        error => this.errorMsg = error, 
        () => { this.setInitialSelectedClient(); });
  }

  /* Purpose: get list of teams for dropdown */
  getTeamsList() {
    this.teamsService.getTeamsList()
      .subscribe(data =>
        this.teamsList = data,
        error => this.errorMsg = error,
        () => { this.setInitialSelectedTeam(); });
  }

  // MODAL DISPLAY

  /* Purpose: shows questionnaire */
  showQuestionnaire(questionnaire) {
    this.assessment.questionaireId = questionnaire.questionaireId;

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

  // UTILITIES

  /* Purpose: set initial value for selected client*/
  setInitialSelectedClient() {
    if (this.isEdit && this.assessment.intendedFor === this.AssessmentOpts.For.Client) {
      this.selectedClient = this.clientsList.find(x => x.clientId == this.assessment.clientId);
      return;
    }
    this.selectedClient = this.clientsList[0];
  }

  /* Purpose: set initial value for selected team */
  setInitialSelectedTeam() {
    if (this.isEdit && this.assessment.intendedFor === this.AssessmentOpts.For.Client && 
        this.assessment.assessmentType === this.AssessmentOpts.Type.TeamAssessment) {
          this.selectedTeam = this.teamsList.find(x => x.teamId == this.assessment.teamId);
          console.log(this.selectedTeam);          
          return;
    }
    this.selectedTeam = this.teamsList[0];
  }

  /* Purpose: append selected values to assessment model for save and update */
  appendAssessmentOptionValues() {
    if (this.assessment.intendedFor==this.AssessmentOpts.For.AllEmployees) {
      this.assessment.clientId = 0;                           // assessment for employees
      this.assessment.teamId = 0;
      this.assessment.assessmentType = this.AssessmentOpts.Type.EmployeeAssessment;
      return;
    }

    this.assessment.clientId = this.selectedClient.clientId;  // assessment for clients
    this.assessment.teamId = (this.assessment.assessmentType === this.AssessmentOpts.Type.GeneralFeedback) 
                                ? 0 : this.selectedTeam.teamId;
  }
}
