import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { QuestionnairesService } from '../../_services/questionnaires.service';
import { AssessmentsService } from '../../_services/assessments.service';
import { AuthService } from '../../_services/auth.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-assessment-employee',
  templateUrl: './assessment-employee.component.html',
  styleUrls: ['./assessment-employee.component.scss']
})
export class AssessmentEmployeeComponent implements OnInit {

  errorMsg: any;
  employee: any;
  assessment: any;
  questionnaire: any = {};
  categories: any = [];
  groupedOptions: any;
  currAssessmentStatus: string;
  enableFields: boolean = false;

  constructor(private bsModalRef: BsModalRef,
              private alertify: AlertifyService,
              private authService: AuthService,
              private _assessmentService: AssessmentsService,
              private _questionnaireService: QuestionnairesService) { }

  ngOnInit() {
    this.initializeValues();
    this.getEmployeeAssessment();
  }

  initializeValues() {
    if (this.assessment.status) {         // if called from the employee page                              
      this.assessment.empAssessmentStatus = this.assessment.status;
    }

    this.currAssessmentStatus = (this.employee.empAssessmentStatus) ?        // check where the value is from; since this component is called from different components
    this.employee.empAssessmentStatus : this.assessment.empAssessmentStatus;

    this.enableFields = (this.currAssessmentStatus==='Unanswered' && !this.authService.isAdmin()) ?
      true : false;                       // questionnaire can only be answerable when the user role is not admin and status is still unanswered
  
   }

  submitQuestionnaire() {
    let empAssessment: any = {};
    let response: any;

    if (this.enableFields) {
      empAssessment = this.getEmpAssessmentToSubmit();

      this._assessmentService.saveEmployeeAssessment(empAssessment)
        .subscribe(
          data => response = data,
          error => this.errorMsg = error,
          () => { 
            if (response) {
              this.alertify.success('Assessment submitted successfully!');
            } else {
              this.alertify.error('Assessment submission - failed!');
            }

            this.bsModalRef.hide();
          }
        );
    }
  }

  setSelectedOptionToModel(questionId, option) {
    let qIdx = this.questionnaire.questionWithOptions             // get index of the answered question then set to model properly
      .findIndex(question => question.questionId == questionId);

    this.questionnaire.questionWithOptions[qIdx].employeeAnswer = option.optionsId;
  }

  // API GET

  getEmployeeAssessment() {
    this._assessmentService.getAssessmentDetail(
        this.assessment.assessmentId
      ).subscribe(data =>
        this.assessment = data, 
        error => this.errorMsg = error,
        () => {          
          if(this.currAssessmentStatus === 'Unanswered') {
            this.getQuestionnaire();
          } else {
            this.getQuestionnaireDetail();
            this.getEmpAssessmentQuestionnaire();
          }
        } 
      );
  }

  getQuestionnaireDetail() {
    this._questionnaireService.getQuestionnaireDetail(
      this.assessment.questionaireId
    ).subscribe(data =>
      this.questionnaire.questionaireInstructions = data.questionaireInstructions, 
      error => this.errorMsg = error
    );
  }

  getEmpAssessmentQuestionnaire() {
    this._assessmentService.getEmpAssessmentQuestionnaire(
        this.assessment.assessmentId,
        this.employee.aspNetUserId
      ).subscribe(data =>
        this.questionnaire.questionWithOptions = data, 
        error => this.errorMsg = error,
        () => {
          this.getCategoriesFromQuestionsArr(this.questionnaire.questionWithOptions);
        } 
      );
  }

  getQuestionnaire() {
    this._questionnaireService.getQuestionnaire(
        this.assessment.questionaireId
      ).subscribe(data =>
        this.questionnaire = data, 
        error => this.errorMsg = error,
        () => {
          this.getCategoriesFromQuestionsArr(this.questionnaire.questionWithOptions);
        } 
      );
  }

  // UTILITIES

  getCategoriesFromQuestionsArr(questions) {
    this.categories = this._questionnaireService.getCategoriesFromQuestionsArr(questions);
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  arrayHasData(arr) {
    return (arr.length > 0) ? true : false;
  }

  getEmpAssessmentToSubmit() {
    let emp: any = {};
    let answers = [];
    let idx = 0;

    emp.employeeAssessment = {};
    emp.employeeAssessment.assessmentId = this.assessment.assessmentId;  // IDs
    emp.employeeAssessment.aspNetUserId = this.employee.aspNetUserId;
    emp.employeeAssessmentAnswers = [];                // initialize array

    this.questionnaire.questionWithOptions.forEach(question => {          // loop questions
      answers[idx] = {};
      answers[idx].employeeAssessmentId = 0;
      answers[idx].questionId = question.questionId;
      answers[idx].answer = question.employeeAnswer;
      idx++;
    });

    emp.employeeAssessmentAnswers = answers;
    return emp;
  }

  // doneAnswering() {
  //   this.questionnaire.questionWithOptions.forEach(question => { 
  //     if(!question.employeeAnswer)
  //       return false;
  //   });
  //   return true;
  // }

}
