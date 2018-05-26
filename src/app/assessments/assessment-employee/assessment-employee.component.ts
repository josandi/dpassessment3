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

  tryModel = 1;

  constructor(private bsModalRef: BsModalRef,
              private alertify: AlertifyService,
              private authService: AuthService,
              private _assessmentService: AssessmentsService,
              private _questionnaireService: QuestionnairesService) { }

  ngOnInit() {
    this.initializeValues();
    this.getEmployeeAssessment();
  }

  // MAIN FUNCTIONS

  /* Purpose: initialize values that may be distinct on different scenarious */
  initializeValues() {
    if (this.assessment.status) {                             // if called from the employee page                              
      this.assessment.empAssessmentStatus = this.assessment.status;
    }

    this.currAssessmentStatus = (this.employee.empAssessmentStatus) ?        // check where the value is from; since this component is called from different components
      this.employee.empAssessmentStatus : this.assessment.empAssessmentStatus;

    this.enableFields = (this.currAssessmentStatus==='Unanswered' && !this.authService.isAdmin()) ?
      true : false;                                           // questionnaire can only be answerable when the user role is not admin and status is still unanswered
  
   }
  
  /* Purpose: retrieves all the necessary data for the view */
   getEmployeeAssessment() {
     this._assessmentService.getAssessmentDetail(
          this.assessment.assessmentId
        ).subscribe(data =>
          this.assessment = data, 
          error => this.errorMsg = error,
          () => {          
            if(this.currAssessmentStatus === 'Unanswered') {   // unanswered: questionnaire only
              this.getQuestionnaire();
            } else {                                           // completed: get questionnaire with answers
              this.getQuestionnaireDetail();
              this.getEmpAssessmentQuestionnaire();
            }
          } 
        );
   }

  /* Purpose: gets entire questionnaire; called when status is unanswered*/
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

  /* Purpose: gets questionnaire detail only; instructions specifically */
  getQuestionnaireDetail() {
    this._questionnaireService.getQuestionnaireDetail(
        this.assessment.questionaireId
      ).subscribe(data =>
        this.questionnaire.questionaireInstructions = data.questionaireInstructions, 
        error => this.errorMsg = error
      );
  }

 /* Purpose: gets entire questionnaire with answers; called when status is completed*/
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

  /* Purpose: called when the form is submitted */
  submitQuestionnaire() {
    if (this.enableFields) {
      if (this.hasAnsweredAllQuestions()) {
        this.saveEmployeeAssessment();
      } else {
        this.alertify.error('All questions must be answered.')
      }      
    }
  }

  /* Purpose: saves answers to database after formatting the data to be sent */
  saveEmployeeAssessment() {
    let empAssessment: any = {};
    let response: any;

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
          this.closeModal();
        }
      );
  }

  // UTILITIES

  /* Purpose: called when option selection has changed; sets selected answer to the specific question*/
  setSelectedOptionToModel(questionId, option) {
    let qIdx = this.questionnaire.questionWithOptions             // get index of the answered question then set to model properly
      .findIndex(question => question.questionId == questionId);

    this.questionnaire.questionWithOptions[qIdx].employeeAnswer = option.optionsId;
  }

  /* Purpose: sets categories array based on the questions set*/
  getCategoriesFromQuestionsArr(questions) {
    this.categories = this._questionnaireService.getCategoriesFromQuestionsArr(questions);
  }

  /* Purpose: condition to check if the display should be group of radio buttons or a textarea */
  arrayHasData(arr) {
    return (arr.length > 0) ? true : false;
  }

  /* Purpose: format answered questionnaire to fit format on post api */
  getEmpAssessmentToSubmit() {
    let emp: any = {};
    let answers = [];
    let idx = 0;

    emp.employeeAssessment = {};
    emp.employeeAssessment.assessmentId = this.assessment.assessmentId; // IDs
    emp.employeeAssessment.aspNetUserId = this.employee.aspNetUserId;
    emp.employeeAssessmentAnswers = [];                                 // initialize array

    this.questionnaire.questionWithOptions.forEach(question => {        // loop questions
      answers[idx] = {};
      answers[idx].employeeAssessmentId = 0;
      answers[idx].questionId = question.questionId;
      answers[idx].answer = question.employeeAnswer;
      idx++;
    });

    emp.employeeAssessmentAnswers = answers;
    return emp;
  }

  /* Purpose: validates if all questions has been answered */
  hasAnsweredAllQuestions() {
    for (let question of this.questionnaire.questionWithOptions) {
      if(!question.employeeAnswer)
        return false;
    }
    return true;
  }

  /* Purpose: hide modal */
  closeModal() {
    this.bsModalRef.hide();
  }

}
